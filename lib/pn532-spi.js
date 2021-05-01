const SoftSPI = require('rpi-softspi');

const PN532_FRAME_LENGTH = 8;

const PN532_PREAMBLE = 0x00;
const PN532_STARTCODE1 = 0x00;
const PN532_STARTCODE2 = 0xff;
const PN532_POSTAMBLE = 0x00;

const PN532_HOSTTOPN532 = 0xd4;
const PN532_PN532TOHOST = 0xd5;

// PN532 Commands
const PN532_COMMAND_DIAGNOSE = 0x00;
const PN532_COMMAND_GETFIRMWAREVERSION = 0x02;
const PN532_COMMAND_GETGENERALSTATUS = 0x04;
const PN532_COMMAND_READREGISTER = 0x06;
const PN532_COMMAND_WRITEREGISTER = 0x08;
const PN532_COMMAND_READGPIO = 0x0c;
const PN532_COMMAND_WRITEGPIO = 0x0e;
const PN532_COMMAND_SETSERIALBAUDRATE = 0x10;
const PN532_COMMAND_SETPARAMETERS = 0x12;
const PN532_COMMAND_samCONFIGURATION = 0x14;
const PN532_COMMAND_POWERDOWN = 0x16;
const PN532_COMMAND_RFCONFIGURATION = 0x32;
const PN532_COMMAND_RFREGULATIONTEST = 0x58;
const PN532_COMMAND_INJUMPFORDEP = 0x56;
const PN532_COMMAND_INJUMPFORPSL = 0x46;
const PN532_COMMAND_INLISTPASSIVETARGET = 0x4a;
const PN532_COMMAND_INATR = 0x50;
const PN532_COMMAND_INPSL = 0x4e;
const PN532_COMMAND_INDATAEXCHANGE = 0x40;
const PN532_COMMAND_INCOMMUNICATETHRU = 0x42;
const PN532_COMMAND_INDESELECT = 0x44;
const PN532_COMMAND_INRELEASE = 0x52;
const PN532_COMMAND_INSELECT = 0x54;
const PN532_COMMAND_INAUTOPOLL = 0x60;
const PN532_COMMAND_TGINITASTARGET = 0x8c;
const PN532_COMMAND_TGSETGENERALBYTES = 0x92;
const PN532_COMMAND_TGGETDATA = 0x86;
const PN532_COMMAND_TGSETDATA = 0x8e;
const PN532_COMMAND_TGSETMETADATA = 0x94;
const PN532_COMMAND_TGGETINITIATORCOMMAND = 0x88;
const PN532_COMMAND_TGRESPONSETOINITIATOR = 0x90;
const PN532_COMMAND_TGGETTARGETSTATUS = 0x8a;

const PN532_RESPONSE_INDATAEXCHANGE = 0x41;
const PN532_RESPONSE_INLISTPASSIVETARGET = 0x4b;

const PN532_WAKEUP = 0x55;

const PN532_SPI_STATREAD = 0x02;
const PN532_SPI_DATAWRITE = 0x01;
const PN532_SPI_DATAREAD = 0x03;
const PN532_SPI_READY = 0x01;

const PN532_MIFARE_ISO14443A = 0x00;

// Mifare Commands
const MIFARE_CMD_AUTH_A = 0x60;
const MIFARE_CMD_AUTH_B = 0x61;
const MIFARE_CMD_READ = 0x30;
const MIFARE_CMD_WRITE = 0xa0;
const MIFARE_CMD_TRANSFER = 0xb0;
const MIFARE_CMD_DECREMENT = 0xc0;
const MIFARE_CMD_INCREMENT = 0xc1;
const MIFARE_CMD_STORE = 0xc2;
const MIFARE_ULTRALIGHT_CMD_WRITE = 0xa2;

// Prefixes for NDEF Records (to identify record type)
const NDEF_URIPREFIX_NONE = 0x00;
const NDEF_URIPREFIX_HTTP_WWWDOT = 0x01;
const NDEF_URIPREFIX_HTTPS_WWWDOT = 0x02;
const NDEF_URIPREFIX_HTTP = 0x03;
const NDEF_URIPREFIX_HTTPS = 0x04;
const NDEF_URIPREFIX_TEL = 0x05;
const NDEF_URIPREFIX_MAILTO = 0x06;
const NDEF_URIPREFIX_FTP_ANONAT = 0x07;
const NDEF_URIPREFIX_FTP_FTPDOT = 0x08;
const NDEF_URIPREFIX_FTPS = 0x09;
const NDEF_URIPREFIX_SFTP = 0x0a;
const NDEF_URIPREFIX_SMB = 0x0b;
const NDEF_URIPREFIX_NFS = 0x0c;
const NDEF_URIPREFIX_FTP = 0x0d;
const NDEF_URIPREFIX_DAV = 0x0e;
const NDEF_URIPREFIX_NEWS = 0x0f;
const NDEF_URIPREFIX_TELNET = 0x10;
const NDEF_URIPREFIX_IMAP = 0x11;
const NDEF_URIPREFIX_RTSP = 0x12;
const NDEF_URIPREFIX_URN = 0x13;
const NDEF_URIPREFIX_POP = 0x14;
const NDEF_URIPREFIX_SIP = 0x15;
const NDEF_URIPREFIX_SIPS = 0x16;
const NDEF_URIPREFIX_TFTP = 0x17;
const NDEF_URIPREFIX_BTSPP = 0x18;
const NDEF_URIPREFIX_BTL2CAP = 0x19;
const NDEF_URIPREFIX_BTGOEP = 0x1a;
const NDEF_URIPREFIX_TCPOBEX = 0x1b;
const NDEF_URIPREFIX_IRDAOBEX = 0x1c;
const NDEF_URIPREFIX_FILE = 0x1d;
const NDEF_URIPREFIX_URN_EPC_ID = 0x1e;
const NDEF_URIPREFIX_URN_EPC_TAG = 0x1f;
const NDEF_URIPREFIX_URN_EPC_PAT = 0x20;
const NDEF_URIPREFIX_URN_EPC_RAW = 0x21;
const NDEF_URIPREFIX_URN_EPC = 0x22;
const NDEF_URIPREFIX_URN_NFC = 0x23;

const PN532_GPIO_VALIDATIONBIT = 0x80;
const PN532_GPIO_P30 = 0;
const PN532_GPIO_P31 = 1;
const PN532_GPIO_P32 = 2;
const PN532_GPIO_P33 = 3;
const PN532_GPIO_P34 = 4;
const PN532_GPIO_P35 = 5;

const PN532_ACK = Uint8Array.from([0x01, 0x00, 0x00, 0xff, 0x00, 0xff, 0x00]);
const PN532_FRAME_START = Uint8Array.from([0x01, 0x00, 0x00, 0xff]);

class PN532 {
  constructor(options) {
    this.client = options.client; // CS (client select) pin
    this.clock = options.clock; // SCLK pin
    this.mosi = options.mosi; // MOSI pin
    this.miso = options.miso; // MISO pin
    this.debug = options.debug || false;

    this.clockMode = 0; // Clock mode (0-3)
    this.bitOrder = SoftSPI.LSB; // Bit order, least significant first

    // Initialize bit bang SPI
    this.spi = new SoftSPI({
      clock: this.clock,
      mosi: this.mosi,
      miso: this.miso,
      client: this.client,
      // mode: this.clockMode,
      bitOrder: this.bitOrder,
    });

    this.spi.open();
  }

  _spiOpen() {
    this.spi.open();
  }

  _spiClose() {
    this.spi.close();
  }

  // Add two values as unsigned 8-bit values
  _uint8Add(a, b) {
    return ((a & 0xff) + (b & 0xff)) & 0xff;
  }

  // Write a frame to the PN532 with the specified data bytearray.
  _writeFrame(data) {
    let length = data.length;
    if (!(0 < data.length < 255)) {
      throw 'Data must be array of 1 to 255 bytes';
    }

    // Build frame to send as:
    // - SPI data write (0x01)
    // - Preamble (0x00)
    // - Start code  (0x00, 0xFF)
    // - Command length (1 byte)
    // - Command length checksum
    // - Command bytes
    // - Checksum
    // - Postamble (0x00)
    let frame = [
      PN532_SPI_DATAWRITE,
      PN532_PREAMBLE,
      PN532_STARTCODE1,
      PN532_STARTCODE2,
      length & 0xff,
      this._uint8Add(~length, 1),
    ].concat(data);

    let checksum = data.reduce(this._uint8Add, 0xff);

    frame.push(~checksum & 0xff);
    frame.push(PN532_POSTAMBLE);

    if (this.debug) console.log('Writing frame: ', frame);

    this.spi.write(frame);
  }

  // Read count bytes from the PN532
  _readData(count) {
    // Build a read request frame
    let frame = new Uint8Array(count);
    frame[0] = PN532_SPI_DATAREAD;

    // Send the frame and return the response, ignoring the SPI header byte
    let response = this.spi.transfer(frame);

    return response;
  }

  // Read a response frame from the PN532 of at most length bytes in size.
  // Returns the data inside the frame if found, otherwise raises an exception
  // if there is an error parsing the frame.  Note that less than length bytes
  // might be returned!
  _readFrame(length) {
    // Read length + frame length
    let response = this._readData(length + PN532_FRAME_LENGTH);
    if (this.debug) console.log('Read frame: ', response);

    // Check frame starts with 0x01 and then has 0x00FF (preceeded by optional
    // zeros).
    if (response[0] != 0x01) {
      throw 'Response frame does not start with 0x01!';
    }

    // Swallow all the 0x00 values that preceed 0xFF
    let offset = 1;
    while (response[offset] == 0x00) {
      offset += 1;
      if (offset >= response.length) {
        throw 'Response frame preamble does not contain 0x00FF!';
      }
    }
    if (response[offset] != 0xff) {
      throw 'Response frame preamble does not contain 0x00FF!';
    }
    offset += 1;
    if (offset >= response.length) {
      throw 'Response contains no data!';
    }

    let frameLen = response[offset];
    if ((frameLen + response[offset + 1]) & (0xff != 0)) {
      throw 'Response length checksum did not match length!';
    }

    // Check frame checksum value matches bytes
    let data = response.slice(offset + 2, offset + 2 + frameLen + 1);
    let checksum = data.reduce(this._uint8Add, 0);
    if (checksum != 0) {
      throw 'Response checksum did not match expected value!';
    }

    // Return frame data
    return data.slice(0, data.length - 1);
  }

  // Wait until the PN532 is ready to receive commands.  At most wait
  // timeoutSeconds seconds for the PN532 to be ready.  If the PN532 is ready
  // before the timeout is exceeded then true will be returned, otherwise
  // false is returned when the timeout is exceeded
  _waitReady(timeoutSeconds = 1) {
    let start = new Date();

    // Send a SPI status read command and read response
    let response = this.spi.transfer([PN532_SPI_STATREAD, 0x00]);

    // Loop until a ready response is received
    while (response[1] != PN532_SPI_READY) {
      if (new Date() - start >= timeoutSeconds * 1000) return false;

      // Wait a little while and try reading the status again
      // sleep.msleep(10)
      response = this.spi.transfer([PN532_SPI_STATREAD, 0x00]);
    }

    return true;
  }

  // Send specified command to the PN532 and expect up to responseLength
  // bytes back in a response.  Note that less than the expected bytes might
  // be returned!  Params can optionally specify an array of bytes to send as
  // parameters to the function call.  Will wait up to timeoutSeconds seconds
  // for a response and return a bytearray of response bytes, or null if no
  // response is available within the timeout
  callFunction(command, responseLength = 0, params = [], timeoutSeconds = 1) {
    // Build frame data with command and parameters
    let data = [PN532_HOSTTOPN532, command & 0xff].concat(params);

    // Send frame and wait for response
    this._writeFrame(data);
    if (!this._waitReady(timeoutSeconds)) return null;

    // Verify ACK response and wait to be ready for function response
    let response = this._readData(PN532_ACK.length);
    if (response.toString() != PN532_ACK.toString()) {
      throw 'Did not receive expected ACK from PN532!';
    }
    if (!this._waitReady(timeoutSeconds)) return null;

    response = this._readFrame(responseLength + 2);

    // Check that response is for the called function
    if (!(response[0] == PN532_PN532TOHOST && response[1] == command + 1)) {
      throw 'Received unexpected command response!';
    }

    return response.slice(2, response.length);
  }

  // Initialize communication with the PN532.  Must be called before any
  // other calls are made against the PN532
  begin() {
    // Assert CS pin low for a second for PN532 to be ready
    this._spiOpen();
    // sleep.sleep(1)

    // Call GetFirmwareVersion to sync up with the PN532.  This might not be
    // required but is done in the Arduino library and kept for consistency
    this.getFirmwareVersion();
    this._spiClose();
  }

  // Call PN532 GetFirmwareVersion function and return a tuple with the IC,
  // Ver, Rev, and Support values
  getFirmwareVersion() {
    let response = this.callFunction(PN532_COMMAND_GETFIRMWAREVERSION, 4);
    if (response == null) {
      throw 'Failed to detect the PN532!  Make sure there is sufficient power (use a 1 amp or greater power supply), the PN532 is wired correctly to the device, and the solder joints on the PN532 headers are solidly connected.';
    }

    return [response[0], response[1], response[2], response[3]];
  }

  // Configure the PN532 to read MiFare cards
  samConfiguration() {
    // Send SAM configuration command with configuration for:
    // - 0x01, normal mode
    // - 0x14, timeout 50ms * 20 = 1 second
    // - 0x01, use IRQ pin
    // Note that no other verification is necessary as call_function will
    // check the command was executed as expected
    this.callFunction(PN532_COMMAND_samCONFIGURATION, 0, [0x01, 0x14, 0x01]);
  }

  // Wait for a MiFare card to be available and return its UID when found.
  // Will wait up to timeout_sec seconds and return null if no card is found,
  // otherwise a bytearray with the UID of the found card is returned
  readPassiveTarget(cardBaud = PN532_MIFARE_ISO14443A, timeoutSeconds = 1) {
    // Send passive read command for 1 card.  Expect at most a 7 byte UUID
    let response = this.callFunction(PN532_COMMAND_INLISTPASSIVETARGET, 17, [
      0x01,
      cardBaud,
    ]);
    // If no response is available return null to indicate no card is present
    if (response == null) return null;

    // Check only 1 card with up to a 7 byte UID is present
    if (response[0] != 0x01) {
      throw 'More than one card detected!';
    }
    if (response[5] > 7) {
      throw 'Found card with unexpectedly long UID!';
    }

    // Return UID of card
    return response.slice(6, 6 + response[5]);
  }

  // Authenticate specified block number for a MiFare classic card.  Uid
  // should be a byte array with the UID of the card, block number should be
  // the block to authenticate, key number should be the key type (like
  // MIFARE_CMD_AUTH_A or MIFARE_CMD_AUTH_B), and key should be a byte array
  // with the key data.  Returns true if the block was authenticated, or false
  // if not authenticated
  mifareClassicAuthenticateBlock(uid, blockNumber, keyNumber, key) {
    // Build parameters for InDataExchange command to authenticate MiFare card
    let uidLen = uid.length;
    let keyLen = key.length;

    let params = [
      0x01, // Max card numbers
      keyNumber & 0xff,
      blockNumber & 0xff,
    ]
      .concat(key)
      .concat(uid);

    // Send InDataExchange request and verify response is 0x00
    let response = this.callFunction(PN532_COMMAND_INDATAEXCHANGE, 1, params);
    return response[0] == 0x00;
  }

  // Read a block of data from the card.  Block number should be the block
  // to read.  If the block is successfully read a bytearray of length 16 with
  // data starting at the specified block will be returned.  If the block is
  // not read then null will be returned
  mifareClassicReadBlock(blockNumber) {
    // Send InDataExchange request to read block of MiFare data
    let response = this.callFunction(PN532_COMMAND_INDATAEXCHANGE, 17, [
      0x01,
      MIFARE_CMD_READ,
      blockNumber & 0xff,
    ]);
    // Check first response is 0x00 to show success
    if (response[0] != 0x00) return null;

    // Return first 4 bytes since 16 bytes are always returned
    return response.slice(1, response.length);
  }

  // Write a block of data to the card.  Block number should be the block
  // to write and data should be a byte array of length 16 with the data to
  // write.  If the data is successfully written then true is returned,
  // otherwise false is returned
  mifareClassicWriteBlock(blockNumber, data) {
    if (data.length != 16) {
      throw 'Data must be an array of 16 bytes!';
    }

    // Build parameters for InDataExchange command to do MiFare classic write
    let params = [
      0x01, // Max card numbers
      MIFARE_CMD_WRITE,
      blockNumber & 0xff,
    ].concat(data);

    // Send InDataExchange request
    let response = this.callFunction(PN532_COMMAND_INDATAEXCHANGE, 17, params);

    return response[0] == 0x00;
  }
}

window.PN532 = PN532;
window.imtired = true;
