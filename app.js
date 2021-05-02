import { MDCTextField } from '@material/textfield';
import { MDCCircularProgress } from '@material/circular-progress';
import { MDCSelect } from '@material/select';
import Keyboard from 'simple-keyboard';
import sjcl from 'sjcl';
import {
  Server,
  Keypair,
  TransactionBuilder,
  BASE_FEE,
  Networks,
  Operation,
  Asset,
} from 'stellar-sdk';
import PN532 from './lib/pn532-spi';

const pn532 = new PN532({
  clock: 40,
  mosi: 38,
  miso: 35,
  client: 36,
});
// Will throw an error if PN532 is unresponsive or misconfigured
let version = pn532.getFirmwareVersion();
console.log('PN532 Firmware version: ', version[1] + '.' + version[2]);
// Configure PN532 for Mifare cards
pn532.samConfiguration();

const server = new Server('https://horizon-testnet.stellar.org');
const destinationId =
  'GBPLYTTJRRCNMQPUIS577VZGV5OD4EPM7PWJNCVKUZPRNF53YXB2LMEE';
const destinationAsset = new Asset(
  'USDC',
  'GC5W3BH2MQRQK2H4A6LP3SXDSAAY2W2W64OWKKVNQIAOVWSAHFDEUSDC'
);
let sourceKeys = null;
let sourceAsset = '';
let encryptedSecret = '';
let sourceAccount = null;
let destinationAmount = 0;
let minAmount = Infinity;
let path = [];
let sourceBalances = {};
let stopScan = false;

const amountTextField = new MDCTextField(
  document.getElementById('amount-text-field')
);
const pincodeTextField = new MDCTextField(
  document.getElementById('pincode-text-field')
);
const assetSelect = new MDCSelect(document.getElementById('asset-select'));
const circularProgress = new MDCCircularProgress(
  document.querySelector('.mdc-circular-progress')
);

let selectedInput = document.getElementById('amount-input');
selectedInput.focus();
circularProgress.determinate = false;

const defaultTheme =
  'hg-theme-default hg-layout-numeric numeric-theme dark-theme';

let keyboard = new Keyboard({
  onChange: (input) => handleChange(input),
  layout: {
    default: ['1 2 3', '4 5 6', '7 8 9', '. 0 {bksp}'],
    pincode: ['1 2 3', '4 5 6', '7 8 9', ' 0 {bksp}'],
  },
  theme: defaultTheme,
  display: { '{bksp}': 'delete' },
  preventMouseDownDefault: true,
  inputName: 'amount-input',
});

function handleChange(input) {
  selectedInput.value = input;
  if (selectedInput.id === 'pincode-input') {
    if (input.length === 6) {
      handlePincodeInput(input);
    }
  }
}

async function handlePincodeInput(pincode) {
  selectedInput.blur();

  try {
    const secret = sjcl.decrypt(pincode, encryptedSecret); // Throws error if pincode is incorrect
    sourceKeys = Keypair.fromSecret(secret);

    keyboard.setOptions({
      theme: `${defaultTheme} hide-keyboard`,
    });
    document.getElementById('nfc-svg').style.display = 'none';
    document.getElementById('pincode-text-field-container').style.display =
      'none';
    document.getElementById('asset-select').style.display = 'block';
    document.getElementById('separator').style.display = 'none';
    document.getElementById('pay-button').style.display = 'block';

    try {
      // Render all balances of an account, the XLM balance is preselected
      sourceAccount = await server.loadAccount(sourceKeys.publicKey());
      const listElement = document.getElementById('asset-list');
      sourceBalances = {};
      let listItem = '';
      for (let balance of sourceAccount.balances) {
        if (balance.asset_type === 'native') {
          listItem = `<li class="mdc-list-item mdc-list-item--selected" data-value="XLM" role="option" tabindex="0">
            <span class="mdc-list-item__ripple"></span>
            <span class="mdc-list-item__text">
              XLM
            </span>
            </li>`;
          sourceBalances['XLM'] = balance.balance;
          getAmountToPay('XLM');
        } else {
          listItem = `<li class="mdc-list-item" data-value=${balance.asset_code}-${balance.asset_issuer} role="option">
            <span class="mdc-list-item__ripple"></span>
            <span class="mdc-list-item__text">
            ${balance.asset_code}
            </span>
            </li>`;
          sourceBalances[balance.asset_code] = balance.balance;
        }
        listElement.insertAdjacentHTML('beforeend', listItem);
      }

      assetSelect.layoutOptions();
      document.getElementById('selected-text').innerText = 'XLM';
      document.querySelector('.mdc-select__anchor').focus();
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    pincodeTextField.valid = false;
    pincodeTextField.helperTextContent = 'Incorrect pincode';
    keyboard.clearInput();
  }
}

async function getAmountToPay(assetValue) {
  document.getElementById('error-response').style.display = 'none';

  const [assetCode, assetIssuer] = assetValue.split('-');
  if (assetCode === 'XLM') {
    sourceAsset = Asset.native();
  } else {
    sourceAsset = new Asset(assetCode, assetIssuer);
  }

  minAmount = Infinity;
  path = [];
  try {
    if (!destinationAmount) {
      throw 'Amount must be greater than 0';
    }
    const response = await server
      .strictReceivePaths([sourceAsset], destinationAsset, destinationAmount)
      .call();
    for (let record of response.records) {
      if (Number(record.source_amount) < Number(minAmount)) {
        minAmount = record.source_amount;
        path = record.path;
      }
    }
    document.getElementById(
      'amount-to-pay'
    ).innerText = `$${minAmount} ${assetCode}`;
    document.getElementById('amount-to-pay').style.display = 'block';

    console.log('Balance:', sourceBalances[assetCode]);
    console.log('Ammount to pay:', minAmount);
    console.log('Path:', path);
    if (Number(sourceBalances[assetCode]) < Number(minAmount)) {
      throw 'Not enough funds!';
    }
  } catch (error) {
    console.log(error);
    document.getElementById('error-response').style.display = 'flex';
    document.querySelector('#error-response span').innerHTML = error;
  }
}

function reset() {
  stopScan = true;

  keyboard.clearInput();
  keyboard.setOptions({
    theme: defaultTheme,
    layoutName: 'default',
  });

  document.getElementById('amount-text-field-container').style.display =
    'block';
  document.getElementById('charge-button').style.display = 'block';
  document.getElementById('nfc-svg').style.display = 'flex';

  document.getElementById('pincode-text-field-container').style.display =
    'none';
  document.getElementById('asset-select').style.display = 'none';

  document.getElementById('separator').style.display = 'none';
  document.getElementById('pay-button').style.display = 'none';

  document.getElementById('amount-to-pay').style.display = 'none';
  document.getElementById('error-response').style.display = 'none';
  document.getElementById('success-response').style.display = 'none';

  document.getElementById('asset-list').innerHTML = '';

  document.getElementById('amount-input').focus();
  document.getElementById('amount-input').value = '';
  document.getElementById('pincode-input').value = '';
  keyboard.clearInput();
}

function readCard(uid, blocksToRead) {
  const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
  const MIFARE_CMD_AUTH_A = 0x60;

  let bufArray = [];
  // Read available blocks
  let sector = 2;
  let block = 0;
  for (let i = 0; i < blocksToRead; i++) {
    const absBlock = sector * 4 + block;
    if (block === 0) {
      const authenticated = pn532.mifareClassicAuthenticateBlock(
        uid,
        absBlock,
        MIFARE_CMD_AUTH_A,
        key
      );
      if (!authenticated) {
        throw new Error('Authentication failed!');
      }
    }
    bufArray.push(pn532.mifareClassicReadBlock(absBlock));
    block += 1;
    if (block === 3) {
      block = 0;
      sector += 1;
    }
  }

  // Transform Array of Buffers to string
  const stringArray = [];
  bufArray[blocksToRead - 1] = bufArray[blocksToRead - 1].filter((num) => num);
  for (const buf of bufArray) {
    stringArray.push(Buffer.from(buf));
  }

  return stringArray.join('');
}

document.getElementById('cancel-button').addEventListener('click', reset);

document.getElementById('charge-button').addEventListener('click', () => {
  destinationAmount = document.getElementById('amount-input').value;

  keyboard.setOptions({
    theme: `${defaultTheme} hide-keyboard`,
  });
  document.getElementById('charge-button').style.display = 'none';
  document.getElementById('cancel-button').style.display = 'block';
  document.getElementById('separator').style.display = 'block';

  stopScan = false;
  // Poll until we get a response and print the UID
  let uid = null;
  function scan() {
    if (stopScan) {
      return;
    }
    if (uid === null) {
      console.log('Waiting for scan...');
      uid = pn532.readPassiveTarget();
      setTimeout(scan, 0);
    } else {
      console.log('Found UID: ', uid);
      const blocksWritten = 15;
      try {
        encryptedSecret = readCard(uid, blocksWritten);
        console.log('Data read:', encryptedSecret);

        keyboard.setOptions({
          theme: defaultTheme,
          layoutName: 'pincode',
        });
        document.getElementById('amount-text-field-container').style.display =
          'none';
        document.getElementById('pincode-text-field-container').style.display =
          'block';
        document.getElementById('pincode-input').focus();
        pincodeTextField.valid = true;
      } catch (error) {
        console.error(error);
        uid = null;
        setTimeout(scan, 0);
      }
    }
  }

  setTimeout(scan, 2000);
});

document.querySelectorAll('input').forEach((input) => {
  input.addEventListener('focus', (event) => {
    selectedInput = document.getElementById(event.target.id);

    keyboard.setOptions({
      inputName: event.target.id,
    });
  });
});

assetSelect.listen('MDCSelect:change', (event) =>
  getAmountToPay(event.detail.value)
);

document.getElementById('pay-button').addEventListener('click', async () => {
  document.getElementById('loading-response').style.display = 'flex';
  let assetPath = [];
  for (let el of path) {
    let asset = null;
    if (el.asset_type === 'native') {
      asset = Asset.native();
    } else {
      asset = new Asset(el.asset_code, el.asset_issuer);
    }
    assetPath.push(asset);
  }
  console.log('Asset path:', assetPath);

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.pathPaymentStrictReceive({
        sendAsset: sourceAsset,
        sendMax: minAmount, // minAmount * 0.01 // allow 1% variation
        destination: destinationId,
        destAsset: destinationAsset,
        destAmount: destinationAmount,
        path: assetPath,
      })
    )
    .setTimeout(30)
    .build();

  // sign the transaction
  transaction.sign(sourceKeys);

  try {
    await server.submitTransaction(transaction);
    document.getElementById('success-response').style.display = 'flex';
    document.getElementById('pay-button').style.display = 'none';
    document.getElementById('separator').style.display = 'block';
    setTimeout(reset, 4000);
  } catch (error) {
    console.log(error);
    document.getElementById('error-response').style.display = 'flex';
    document.querySelector('#error-response span').innerHTML = error;
  } finally {
    document.getElementById('loading-response').style.display = 'none';
  }
});
