'use strict';

function compare(lhs_array, rhs_array) {
    if (lhs_array.byteLength != rhs_array.byteLength) {
        return false;
    }

    for (var i = 0; i < lhs_array.byteLength; ++i) {
        if (lhs_array[i] !== rhs_array[i]) {
            return false;
        }
    }

    return true;
}

function ascii2buf(str) {
    var view = new Uint8Array(str.length)

    for (var i = 0; i < str.length; ++i) {
        view[i] = str.charCodeAt(i)
    }

    return view;
}

function buf2ascii(buf) {
    return String.fromCharCode.apply(null, buf)
}

var CommonSettings = React.createClass({
    render: function() {
        return (
            <div className="gui_box grey">
                <div className="gui_box_titlebar">
                    <div className="spacer_box_title">Common Parameters</div>
                </div>
                <div className="spacer_box">
                    {this.renderControls()}
                </div>
            </div>
        );
    },
    handleCheckbox: function(e) {        
        var name = e.target.name,
            value = e.target.checked ? 1 : 0,
            escSettings = this.props.escSettings;

        escSettings.forEach(settings => settings[BLHELI_LAYOUT[name].offset] = value);

        this.props.onUserInput(escSettings);
    },
    handleSelect: function(e) {
        var name = e.target.name,
            value = e.target.value,
            escSettings = this.props.escSettings;

        escSettings.forEach(settings => settings[BLHELI_LAYOUT[name].offset] = value);

        this.props.onUserInput(escSettings);
    },
    handleNumber: function(e) {
        var el = e.target,
            escSettings = this.props.escSettings,
            value = Math.max(Math.min(el.value, el.max), el.min);

        // @todo validate new value, handle step
        escSettings.forEach(settings => settings[BLHELI_LAYOUT[el.name].offset] = value);

        this.props.onUserInput(escSettings);
    },
    renderCheckbox: function(name, label) {
        return (
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        name={name}
                        checked={this.props.escSettings[0][BLHELI_LAYOUT[name].offset] === 1}
                        onChange={this.handleCheckbox}
                    />
                    <span>{chrome.i18n.getMessage(label)}</span>
                </label>
            </div>
        );
    },
    renderSelect: function(name, options, label) {
        return (
            <div className="select">
                <label>
                    <select
                        name={name}
                        value={this.props.escSettings[0][BLHELI_LAYOUT[name].offset]}
                        onChange={this.handleSelect}
                    >
                        {
                            options.map(pair => <option value={pair[0]}>{pair[1]}</option>)
                        }
                    </select>
                    <span>{chrome.i18n.getMessage(label)}</span>
                </label>
            </div>
        );
    },
    renderNumber: function(name, min, max, step, label) {
        return (
            <div className="number">
                <label>
                    <input
                        type="number"
                        name={name}
                        step={step}
                        min={min}
                        max={max}
                        value={this.props.escSettings[0][BLHELI_LAYOUT[name].offset]}
                        onChange={this.handleNumber}
                    />
                    <span>{chrome.i18n.getMessage(label)}</span>
                </label>
            </div>
        );
    },
    renderControls: function() {
        if (this.props.escSettings.length === 0) {
            return null;
        }

        const noneAvailable = !this.props.escMetainfo.some(info => info.available);
        if (noneAvailable) {
            return null;
        }

        // @todo check all ESCs are in sync
        var rows = [];

        // if mode
        // if version
        // foreach setting
        //  generate

        rows.push(this.renderCheckbox('PROGRAMMING_BY_TX', 'escProgrammingByTX'));
        rows.push(this.renderSelect(
            'GOVERNOR_MODE',
            [ [ '1', 'HiRange' ], [ '2', 'MidRange' ], [ '3', 'LoRange' ], [ '4', 'Off' ] ],
            'escClosedLoopMode'
        ));
        if (this.props.escSettings[0][BLHELI_LAYOUT['GOVERNOR_MODE'].offset] !== 4) {
            const options = [
                [ '1', '0.13' ], [ '2', '0.17' ], [ '3', '0.25' ], [ '4', '0.38' ],
                [ '5', '0.50' ], [ '6', '0.75' ], [ '7', '1.00' ], [ '8', '1.50' ],
                [ '9', '2.00' ], [ '10', '3.00' ], [ '11', '4.00' ], [ '12', '6.00' ],
                [ '13', '8.00' ]
            ];

            rows.push(this.renderSelect('P_GAIN', options, 'escClosedLoopPGain'));
            rows.push(this.renderSelect('I_GAIN', options, 'escClosedLoopIGain'));
        }
        rows.push(this.renderSelect(
            'MOTOR_GAIN',
            [ [ '1', '0.75' ], [ '2', '0.88' ], [ '3', '1.00' ], [ '4', '1.12' ], [ '5', '1.25'] ],
            'escMotorGain'
        ));
        rows.push(this.renderSelect(
            'STARTUP_POWER',
            [ [ '1', '0.031' ], [ '2', '0.047' ], [ '3', '0.063' ], [ '4', '0.094' ], [ '5', '0.125' ], [ '6', '0.188' ], [ '7', '0.25' ], [ '8', '0.38' ], [ '9', '0.50' ], [ '10', '0.75' ], [ '11', '1.00' ], [ '12', '1.25' ], [ '13', '1.50' ] ],
            'escStartupPower'
        ));
        rows.push(this.renderCheckbox('TEMPERATURE_PROTECTION', 'escTemperatureProtection'));
        rows.push(this.renderSelect(
            'PWM_DITHER',
            [ [ '1', 'Off' ], [ '2', '3' ], [ '3', '7' ], [ '4', '15' ], [ '5', '31' ] ],
            'escPWMOutputDither'
        ));
        rows.push(this.renderCheckbox('LOW_RPM_POWER_PROTECTION', 'escLowRPMPowerProtection'));
        rows.push(this.renderCheckbox('BRAKE_ON_STOP', 'escBrakeOnStop'));
        rows.push(this.renderSelect(
            'DEMAG_COMPENSATION',
            [ [ '1', 'Off' ], [ '2', 'Low' ], [ '3', 'High' ] ],
            'escDemagCompensation'
        ));
        rows.push(this.renderSelect(
            'PWM_FREQUENCY',
            [ [ '1', 'Off' ], [ '2', 'Low' ], [ '3', 'DampedLight' ] ],
            'escPWMFrequencyDamped'
        ));
        rows.push(this.renderCheckbox('PWM_INPUT', 'escEnablePWMInput'));
        rows.push(this.renderSelect(
            'COMMUTATION_TIMING',
            [ [ '1', 'Low' ], [ '2', 'MediumLow' ], [ '3', 'Medium' ], [ '4', 'MediumHigh' ], [ '5', 'High' ] ],
            'escMotorTiming'
        ));
        rows.push(this.renderSelect(
            'INPUT_PWM_POLARITY',
            [ [ '1', 'Positive' ], [ '2', 'Negative' ] ],
            'escInputPolarity'
        ));
        rows.push(this.renderNumber('BEEP_STRENGTH', 1, 255, 1, 'escBeepStrength'));
        rows.push(this.renderNumber('BEACON_STRENGTH', 1, 255, 1, 'escBeaconStrength'));
        rows.push(this.renderSelect(
            'BEACON_DELAY',
            [ [ '1', '1 minute' ], [ '2', '2 minutes' ], [ '3', '5 minutes' ], [ '4', '10 minutes' ], [ '5', 'Infinite' ] ],
            'escBeaconDelay'
        ));

        return rows;
    }
});

var IndividualSettings = React.createClass({
    getInitialState: function() {
        return {
            canFlash: true,
            isFlashing: false,
            progress: 0
        };
    },
    render: function() {
        return (
            <div className="gui_box grey">
                <div className="gui_box_titlebar">
                    <div className="spacer_box_title">
                        {this.getTitle()}
                    </div>
                </div>
                <div className="spacer_box">
                    {this.renderControls()}
                </div>
            </div>
        );
    },
    getTitle: function() {
        var escSettings = this.props.escSettings[this.props.escIndex],
            escMetainfo = this.props.escMetainfo[this.props.escIndex],
            layoutBuf = escSettings.subarray(BLHELI_LAYOUT.LAYOUT.offset, BLHELI_LAYOUT.LAYOUT.offset + BLHELI_LAYOUT.LAYOUT.size),
            nameBuf = escSettings.subarray(BLHELI_LAYOUT.NAME.offset, BLHELI_LAYOUT.NAME.offset + BLHELI_LAYOUT.NAME.size),
            layout = buf2ascii(layoutBuf).trim(),
            name = buf2ascii(nameBuf).trim(),
            make = layout.length > 0 ? layout : 'EMPTY';

        if (escMetainfo.interface_mode === _4way_modes.SiLBLB) {
            if (BLHELI_SILABS_ESCS.hasOwnProperty(layout)) {
                make = BLHELI_SILABS_ESCS[layout].name
            } else if (BLHELI_S_SILABS_ESCS.hasOwnProperty(layout)) {
                make = BLHELI_S_SILABS_ESCS[layout].name
            }
        } else {
            if (BLHELI_ATMEL_ESCS.hasOwnProperty(layout)) {
                make = BLHELI_ATMEL_ESCS[layout].name
            }
        }

        return 'ESC ' + (this.props.escIndex + 1) + ': ' + make + ', ' +
            escSettings[0] + '.' + escSettings[1] + (name.length > 0 ? ', ' + name : '');
    },
    renderControls: function() {
        var rows = [];

        rows.push(this.renderSelect(
            'MOTOR_DIRECTION',
            [ [ '1', 'Normal' ], [ '2', 'Reversed' ], [ '3', 'Bidirectional' ], [ '4', 'Bidirectional Reversed' ] ],
            'escMotorDirection'
        ));
        rows.push(this.renderNumber('PPM_MIN_THROTTLE', 1000, 1500, 4, 'escPPMMinThrottle'));
        rows.push(this.renderNumber('PPM_MAX_THROTTLE', 1520, 2020, 4, 'escPPMMaxThrottle'));
        if (this.props.escSettings[this.props.escIndex][BLHELI_LAYOUT['MOTOR_DIRECTION'].offset] > 2) {
            rows.push(this.renderNumber('PPM_CENTER_THROTTLE', 1000, 2020, 4, 'escPPMCenterThrottle'));
        }

        rows.push(
            <div className="half">
                <div className="default_btn half">
                    {this.renderFlashButtonOrProgress()}
                </div>
            </div>
        );

        return rows;
    },
    renderFlashButtonOrProgress: function() {
        if (this.state.isFlashing) {
            return (
                <progress className="progress" value={this.state.progress} min="0" max="100" />
            );
        }

        return (
            <a
                href="#"
                className={this.state.canFlash ? "" : "disabled"}
                onClick={this.flashFirmware}
            >
                {chrome.i18n.getMessage('escButtonFlash')}
            </a>
        );
    },
    renderSelect: function(name, options, label) {
        return (
            <div className="select">
                <label>
                    <select
                        name={name}
                        value={this.props.escSettings[this.props.escIndex][BLHELI_LAYOUT[name].offset]}
                        onChange={this.handleSelect}
                    >
                        {
                            options.map(pair => <option value={pair[0]}>{pair[1]}</option>)
                        }
                    </select>
                    <span>{chrome.i18n.getMessage(label)}</span>
                </label>
            </div>
        );
    },
    renderNumber: function(name, min, max, step, label) {
        return (
            <div className="number">
                <label>
                    <input
                        type="number"
                        name={name}
                        step={step}
                        min={min}
                        max={max}
                        value={this.props.escSettings[this.props.escIndex][BLHELI_LAYOUT[name].offset]}
                        onChange={this.handleNumber}
                    />
                    <span>{chrome.i18n.getMessage(label)}</span>
                </label>
            </div>
        );
    },
    handleSelect: function(e) {
        var name = e.target.name,
            value = e.target.value,
            escSettings = this.props.escSettings;

        escSettings[this.props.escIndex][BLHELI_LAYOUT[name].offset] = value;

        this.props.onUserInput(escSettings);
    },
    handleNumber: function(e) {
        var el = e.target,
            escSettings = this.props.escSettings;

        // @todo validate new value, handle step
        escSettings[this.props.escIndex][BLHELI_LAYOUT[el.name].offset] = Math.max(Math.min(el.value, el.max), el.min);

        this.props.onUserInput(escSettings);
    },
    flashFirmware: function() {

    }
});

var Configurator = React.createClass({
    getInitialState: () => {
        return {
            canRead: true,
            canWrite: false,
            escSettings: [],
            escMetainfo: [],
            ignoreMCULayout: false,
        };
    },
    componentDidMount: function() {

    },
    onUserInput: function(newSettings) {
        this.setState({
            escSettings: newSettings
        });
    },
    readSetup: function() {
        GUI.log('reading ESC setup');
        // disallow further requests until we're finished
        // @todo also disable settings alteration
        this.setState({
            canRead: false,
            canWrite: false
        });

        this.readSetupImpl()
        .then(() => {
            this.setState({
                canRead: true,
                canWrite: true
            });
            GUI.log('ESC setup read');   
        })
        .done();
    },
    readSetupImpl: function() {
        var promise = Q(),
            escSettings = [],
            escMetainfo = [];

        for (let esc = 0; esc < this.props.escCount; ++esc) {
            escSettings.push({});
            escMetainfo.push({});

            promise = promise
            // Ask 4way interface to initialize target ESC for flashing
            .then(_4way.initFlash.bind(_4way, esc))
            // Check interface mode and read settings
            .then(message => {
                var interface_mode = message.params[3]

                // remember interface mode for ESC
                escMetainfo[esc].interface_mode = interface_mode

                // read everything in one big chunk
                // SiLabs has no separate EEPROM, but Atmel has and therefore requires a different read command
                var isSiLabs = [ _4way_modes.SiLC2, _4way_modes.SiLBLB ].includes(interface_mode)

                if (isSiLabs) {
                    return _4way.read(BLHELI_SILABS_EEPROM_OFFSET, BLHELI_LAYOUT_SIZE);
                }
                
                return _4way.readEEprom(0, BLHELI_LAYOUT_SIZE);
            })
            // Ensure MULTI mode and correct BLHeli version
            .then(message => {
                // Check whether revision is supported
                var esc_settings = message.params,
                    main_revision = esc_settings[0],
                    sub_revision = esc_settings[1],
                    layout_revision = esc_settings[2]

                if (layout_revision < BLHELI_MIN_SUPPORTED_LAYOUT_REVISION) {
                    GUI.log('ESC ' + (esc + 1) + ' has LAYOUT_REVISION ' + layout_revision + ', oldest supported is ' + BLHELI_MIN_SUPPORTED_LAYOUT_REVISION)
                }

                // Check for MULTI mode
                // @todo replace with a DataView
                var mode = esc_settings.subarray(BLHELI_LAYOUT.MODE.offset, BLHELI_LAYOUT.MODE.offset + BLHELI_LAYOUT.MODE.size)
                    .reduce(function(sum, byte) { return (sum << 8) | byte; })
                if (mode != BLHELI_MODES.MULTI) {
                    GUI.log('ESC ' + (esc + 1) + ' has MODE different from MULTI: ' + mode.toString(0x10))
                }

                escSettings[esc] = esc_settings
                escMetainfo[esc].available = true
            })
            .then(_4way.reset.bind(_4way, esc))
            .catch(error => {
                escMetainfo[esc].available = false
            })
        }

        return promise.then(() => {
            // Update backend and trigger representation
            this.setState({
                escSettings: escSettings,
                escMetainfo: escMetainfo
            });
        });
    },
    writeSetupImpl: function() {
        var promise = Q()

        for (let esc = 0; esc < this.state.escSettings.length; ++esc) {
            if (!this.state.escMetainfo[esc].available) {
               continue;
            }

            promise = promise
            // Ask 4way interface to initialize target ESC for flashing
            .then(_4way.initFlash.bind(_4way, esc))
            // Remember interface mode and read settings
            .then(message => {
                var interface_mode = message.params[3]

                // remember interface mode for ESC
                // this.setState(state => {
                //     state.escMetainfo[esc].interface_mode = interface_mode;
                //     return state;
                // })

                // read everything in one big chunk to check if any settings have changed
                // SiLabs has no separate EEPROM, but Atmel has and therefore requires a different read command
                var isSiLabs = [ _4way_modes.SiLC2, _4way_modes.SiLBLB ].includes(interface_mode)

                if (isSiLabs) {
                    return _4way.read(BLHELI_SILABS_EEPROM_OFFSET, BLHELI_LAYOUT_SIZE);
                }
                
                return _4way.readEEprom(0, BLHELI_LAYOUT_SIZE);
            })
            // Check for changes and perform write
            .then(message => {
                var escSettings = this.state.escSettings[esc],
                    readbackSettings = message.params

                // check for unexpected size mismatch
                if (escSettings.byteLength != readbackSettings.byteLength) {
                    throw new Error('byteLength of buffers do not match')
                }

                // check for actual changes, maybe we should not write to this ESC at all
                if (compare(escSettings, readbackSettings)) {
                    GUI.log('ESC ' + (esc + 1) + ': no changes')
                    return
                }

                var interface_mode = this.state.escMetainfo[esc].interface_mode,
                    isSiLabs = [ _4way_modes.SiLC2, _4way_modes.SiLBLB ].includes(interface_mode),
                    promise = Q()

                // should erase page to 0xFF on SiLabs before writing
                if (isSiLabs) {
                    promise = promise
                    .then(_4way.pageErase.bind(_4way, BLHELI_SILABS_EEPROM_OFFSET / BLHELI_SILABS_PAGE_SIZE))
                    // actual write
                    .then(_4way.write.bind(_4way, BLHELI_SILABS_EEPROM_OFFSET, escSettings))
                } else {
                    // write only changed bytes for Atmel
                    for (var pos = 0; pos < escSettings.byteLength; ++pos) {
                        var offset = pos

                        // find the longest span of modified bytes
                        while (escSettings[pos] != readbackSettings[pos]) {
                            ++pos
                        }

                        // byte unchanged, continue
                        if (offset == pos) {
                            continue
                        }

                        // write span
                        promise = promise
                        .then(_4way.writeEEprom.bind(_4way, offset, escSettings.subarray(offset, pos)))
                    }
                }

                promise = promise
                // readback
                .then(() => {
                    // SiLabs has no separate EEPROM, but Atmel has and therefore requires a different read command
                    var isSiLabs = [ _4way_modes.SiLC2, _4way_modes.SiLBLB ].includes(interface_mode)

                    if (isSiLabs) {
                        return _4way.read(BLHELI_SILABS_EEPROM_OFFSET, BLHELI_LAYOUT_SIZE);
                    }
                    
                    return _4way.readEEprom(0, BLHELI_LAYOUT_SIZE);
                })
                // verify
                .then(message => {
                    if (!compare(escSettings, message.params)) {
                        throw new Error('Failed to verify settings')
                    }
                })

                return promise
            })
            .then(_4way.reset.bind(_4way, esc))
            .catch(error => {
                GUI.log('ESC ' + (esc + 1) + ', failed to write settings: ' + error.message)
            })
        }

        return promise
    },
    writeSetup: function() {
        GUI.log('writing ESC setup');
        // disallow further requests until we're finished
        // @todo also disable settings alteration
        this.setState({
            canRead: false,
            canWrite: false
        });

        this.writeSetupImpl()
        .then(() => {
            GUI.log('ESC setup written');
            this.readSetup();
        })
        .done();
    },
    render: function() {
        return (
            <div>
                <div className="content_wrapper">
                    <div className="tab_title">ESC Programming</div>
                    <div className="note" style={{marginBottom: 20}}>
                        <div className="note_spacer">
                            <p>{chrome.i18n.getMessage('escFeaturesHelp')}</p>
                        </div>
                    </div>
                    <div className="checkbox">
                        <input type="checkbox" className="toggle" />
                        <label>
                            <span>{chrome.i18n.getMessage('escIgnoreInappropriateMCULayout')}</span>
                        </label>
                    </div>
                    <div className="leftWrapper common-config">
                        {this.renderCommonSettings()}
                    </div>
                    <div className="rightWrapper individual-config">
                        {this.renderIndividualSettings()}
                    </div>
                </div>
                <div className="content_toolbar">
                    <div className="btn">
                        <a
                            href="#"
                            className={this.state.canRead ? "read" : "read disabled"}
                            onClick={this.readSetup}
                        >
                            {chrome.i18n.getMessage('escButtonRead')}
                        </a>
                    </div>
                    <div className="btn">
                        <a
                            href="#"
                            className={this.state.canWrite ? "write" : "write disabled"}
                            onClick={this.writeSetup}
                        >
                            {chrome.i18n.getMessage('escButtonWrite')}
                        </a>
                    </div>
                </div>
            </div>
        );
    },
    renderCommonSettings: function() {
        const noneAvailable = !this.state.escMetainfo.some(info => info.available);
        if (noneAvailable) {
            return null;
        }

        return (
            <CommonSettings
                escSettings={this.state.escSettings}
                escMetainfo={this.state.escMetainfo}
                onUserInput={this.onUserInput}
            />
        );
    },
    renderIndividualSettings: function() {
        return this.state.escMetainfo.map((info, idx) => {
            if (!info.available) {
                return null;
            }

            return (
                <IndividualSettings
                    escIndex={idx}
                    escSettings={this.state.escSettings}
                    escMetainfo={this.state.escMetainfo}
                    onUserInput={this.onUserInput}
                />
            );
        });
    }
});

TABS.esc = {
    esc_settings: [],
    esc_metainfo: [],
    ignore_inappropriate_mcu_layout: false
};

TABS.esc.print = function (str) {
    GUI.log(str);
};

TABS.esc.initialize = function (callback) {
    var self = this;

    if (GUI.active_tab != 'esc') {
        GUI.active_tab = 'esc';
        googleAnalytics.sendAppView('ESC');
    }

    function load_html() {
        // set flag to allow messages redirect to 4way-if handler
        CONFIGURATOR.escActive = true;
        $('#content').load("./tabs/esc.html", process_html);
    }

    function process_html() {
        // translate to user-selected language
        localize();
        ReactDOM.render(
            <Configurator escCount={ESC_CONFIG.connectedESCs} />,
            document.getElementById('configurator')
        );

        GUI.content_ready(callback);
    }

    function flash_firmware() {
        var button_e = $(this),
            progress_e = button_e.siblings('progress.progress'),
            escIdx = button_e.data('esc'),
            esc_settings = self.esc_settings[escIdx],
            esc_metainfo = self.esc_metainfo[escIdx],
            start_timestamp = Date.now(),
            is_atmel = [ _4way_modes.AtmBLB, _4way_modes.AtmSK ].includes(esc_metainfo.interface_mode)

        var flash_image, eeprom_image

        // rough estimate, each location gets erased, written and verified at least once
        var max_flash_size = is_atmel ? BLHELI_ATMEL_BLB_ADDRESS_8 : BLHELI_SILABS_ADDRESS_SPACE_SIZE,
            bytes_to_process = max_flash_size * 3,
            bytes_processed = 0

        // Disallow clicking again
        $('a.flash, a.connect').addClass('disabled')

        // Ask user to select HEX
        select_file('hex')
        .then(parse_hex)
        .then(data => {
            if (data) {
                self.print('Loaded local firmware: ' + data.bytes_total + ' bytes')
                flash_image = fill_image(data, max_flash_size)
            } else {
                throw new Error('HEX file corrupt')
            }
        })
        // Ask EEP on Atmel
        .then(() => {
            if (is_atmel) {
                return select_file('eep')
                .then(parse_hex)
                .then(data => {
                    if (data) {
                        self.print('Loaded local EEprom: ' + data.bytes_total + 'bytes')
                        eeprom_image = fill_image(data, BLHELI_ATMEL_EEPROM_SIZE)
                    } else {
                        throw new Error('EEP file corrupt')
                    }
                })
            }
        })
        // validate files
        .then(() => {
            if (is_atmel) {
                var mcu = buf2ascii(eeprom_image.subarray(BLHELI_LAYOUT.MCU.offset, BLHELI_LAYOUT.MCU.offset + BLHELI_LAYOUT.MCU.size))

                if (!mcu.includes('#BLHELI#')) {
                    throw new Error('EEP does not look like a valid Atmel BLHeli EEprom file')
                }
            } else {
                var buf = flash_image.subarray(BLHELI_SILABS_EEPROM_OFFSET).subarray(BLHELI_LAYOUT.MCU.offset, BLHELI_LAYOUT.MCU.offset + BLHELI_LAYOUT.MCU.size),
                    mcu = buf2ascii(buf)

                if (!mcu.includes('#BLHELI#')) {
                    throw new Error('HEX does not look like a valid SiLabs BLHeli flash file')
                }
            }

            // @todo some sanity checks on size of flash
        })
        // show progress bar
        .then(() => progress_e.val(0).show())
        // start the actual flashing process
        .then(_4way.initFlash.bind(_4way, escIdx))
        // select flashing algorithm given interface mode
        .then(select_interface)
        // migrate settings from previous version if asked to
        .then(_4way.read.bind(_4way, BLHELI_SILABS_EEPROM_OFFSET, BLHELI_LAYOUT_SIZE))
        .then(function(message) {
            var new_settings = message.params,
                offset = BLHELI_LAYOUT.MODE.offset;

            // @todo move elsewhere
            on_finished()

            // ensure mode match
            if (compare(new_settings.subarray(offset, offset + 2), esc_settings.subarray(offset, offset + 2))) {
                self.print('Writing settings back\n');
                // copy changed settings
                var begin = BLHELI_LAYOUT.P_GAIN.offset,
                    end = BLHELI_LAYOUT.BRAKE_ON_STOP.offset + BLHELI_LAYOUT.BRAKE_ON_STOP.size;

                new_settings.set(esc_settings.subarray(begin, end), begin);

                // set settings as current
                self.esc_settings[escIdx] = new_settings;

                return write_settings()
            } else {
                self.print('Will not write settings back due to different MODE\n');

                // read settings back
                return read_settings()
            }
        })
        .catch(on_failed)
        .done()

        function update_progress(bytes) {
            bytes_processed += bytes;
            progress_e.val(Math.min(Math.ceil(100 * bytes_processed / bytes_to_process), 100));
        }

        function parse_hex(data) {
            // parsing hex in different thread
            var worker = new Worker('./js/workers/hex_parser.js'),
                deferred = Q.defer()

            worker.onmessage = event => deferred.resolve(event.data)
            // send data over for processing
            worker.postMessage(data)

            return deferred.promise
        }

        function select_file(ext) {
            var deferred = Q.defer()

            // Open file dialog
            chrome.fileSystem.chooseEntry({
                type: 'openFile',
                accepts: [ { extensions: [ ext ] } ]
            }, fileEntry => {
                if (chrome.runtime.lastError) {
                    deferred.reject(new Error(chrome.runtime.lastError.message))
                    return
                }

                chrome.fileSystem.getDisplayPath(fileEntry, path => {
                    self.print('Loading file from ' + path)

                    fileEntry.file(file => {
                        var reader = new FileReader

                        reader.onprogress = e => {
                            if (e.total > 32 * 1024) { // 32 KiB
                                deferred.reject('File size limit of 32 KiB exceeded')
                            }
                        }

                        reader.onloadend = e => {
                            if (e.total !== 0 && e.total === e.loaded) {
                                self.print('Loaded file ' + path)

                                deferred.resolve(e.target.result)
                            } else {
                                deferred.reject(new Error('Failed to load ' + path))
                            }
                        }

                        reader.readAsText(file)
                    })
                })
            })

            return deferred.promise
        }

        // Fills a memory image of ESC MCU's address space with target firmware
        function fill_image(data, size) {
            var image = new Uint8Array(size).fill(0xFF)

            data.data.forEach(function(block) {
                // Check preconditions
                if (block.address >= image.byteLength) {
                    if (block.address == BLHELI_SILABS_BOOTLOADER_ADDRESS) {
                        self.print('Block at 0x' + block.address.toString(0x10) + ' of 0x' + block.bytes.toString(0x10) + ' bytes contains bootloader, skipping\n');
                    } else {
                        self.print('Block at 0x' + block.address.toString(0x10) + ' is outside of target address space\n');
                    }

                    return;
                }

                if (block.address + block.bytes >= image.byteLength) {
                    self.print('Block at 0x' + block.address.toString(0x10) + ' spans past the end of target address space\n');
                }

                // block.data may be too large, select maximum allowed size
                var clamped_length = Math.min(block.bytes, image.byteLength - block.address);
                image.set(block.data.slice(0, clamped_length), block.address);
            })

            return image
        }

        function select_interface(message) {
            var interface_mode = message.params[3]
            esc_metainfo.interface_mode = interface_mode

            switch (interface_mode) {
                case _4way_modes.SiLBLB: return flash_silabs_blb(message)
                case _4way_modes.AtmBLB:
                case _4way_modes.AtmSK:  return flash_atmel(message)
                default: throw new Error('Flashing with interface mode ' + interface_mode + ' is not yet implemented')
            }
        }

        function flash_silabs_blb(message) {
            // @todo check device id

            // read current settings
            return _4way.read(BLHELI_SILABS_EEPROM_OFFSET, BLHELI_LAYOUT_SIZE)
            // check MCU and LAYOUT
            .then(check_esc_and_mcu)
            // erase EEPROM page
            .then(erase_page.bind(undefined, 0x0D))
            // write **FLASH*FAILED** as ESC NAME
            .then(write_eeprom_safeguard)
            // write `LJMP bootloader` to avoid bricking            
            .then(write_bootloader_failsafe)
            // erase up to EEPROM, skipping first two first pages with bootloader failsafe
            .then(erase_pages.bind(undefined, 0x02, 0x0D))
            // write & verify just erased locations
            .then(write_pages.bind(undefined, 0x02, 0x0D))
            // write & verify first page
            .then(write_page.bind(undefined, 0x00))
            // erase second page
            .then(erase_page.bind(undefined, 0x01))
            // write & verify second page
            .then(write_page.bind(undefined, 0x01))
            // erase EEPROM
            .then(erase_page.bind(undefined, 0x0D))
            // write & verify EEPROM
            .then(write_page.bind(undefined, 0x0D))
        }

        // @todo
        // 1. add check for ATmega8 vs. ATmega16, they have different flash and eeprom sizes
        function flash_atmel(message) {
            // SimonK uses word instead of byte addressing for flash and address arithmetic on subsequent reads/writes
            var is_simonk = esc_metainfo.interface_mode === _4way_modes.AtmSK
            // @todo check device id

            return _4way.readEEprom(0, BLHELI_LAYOUT_SIZE)
            // check MCU and LAYOUT
            .then(check_esc_and_mcu)
            // write **FLASH*FAILED** as NAME
            .then(() => {
                var bytes = ascii2buf('**FLASH*FAILED**')

                return _4way.writeEEprom(BLHELI_LAYOUT.NAME.offset, bytes)
                .then(_4way.readEEprom.bind(_4way, BLHELI_LAYOUT.NAME.offset, BLHELI_LAYOUT.NAME.size))
                .then(message => {
                    if (!compare(bytes, message.params)) {
                        throw new Error('Failed to verify write **FLASH*FAILED**')
                    }
                })
            })
            // write RCALL bootloader_start
            .then(() => {
                var address = is_simonk ? 0x20 : 0x40,
                    // @todo for BLHeli we can jump 0x200 bytes further, do it
                    rcall = [ 0xDF, 0xCD ],
                    bytes = new Uint8Array(64).fill(0xFF)

                bytes.set(rcall)

                return _4way.write(address, bytes)
                .then(_4way.read.bind(_4way, address, rcall.length))
                .then(message => {
                    if (!compare(rcall, message.params)) {
                        throw new Error('Failed to verify `RCALL bootloader` write')
                    }
                })
            })
            // erase first 64 bytes up to RCALL written in the previous step
            .then(() => {
                var bytes = new Uint8Array(64).fill(0xFF)

                return _4way.write(0, bytes)
                .then(_4way.read.bind(_4way, 0, bytes.byteLength))
                .then(message => {
                    if (!compare(bytes, message.params)) {
                        throw new Error('Failed to verify erasure of first 64 bytes')
                    }  
                })
            })
            // write from 0x80 up to bootloader start
            .then(() => {
                var begin_address = 0x80,
                    end_address = BLHELI_ATMEL_BLB_ADDRESS_8
                    write_step = is_simonk ? 0x40 : 0x100,
                    verify_step = 0x100,
                    promise = Q()

                // write
                for (var address = begin_address; address < end_address; address += write_step) {
                    var end = min(address + write_step, end_address),
                        write_address = address

                    if (is_simonk) {
                        if (address === begin_address) {
                            write_address /= 2
                        } else {
                            // SimonK bootloader will continue from the last address where we left off
                            write_address = 0xFFFF
                        }
                    }

                    promise = promise
                    .then(_4way.write.bind(_4way, write_address, flash_image.subarray(address, end)))
                    .then(message => {
                        update_progress(message.params.byteLength)
                    })
                }

                // verify
                for (let address = begin_address; address < end_address; address += verify_step) {
                    var bytesToRead = min(address + verify_step, end_address) - address,
                        read_address = address

                    if (is_simonk) {
                        if (address === begin_address) {
                            read_address /= 2
                        } else {
                            // SimonK bootloader will continue from the last address where we left off
                            read_address = 0xFFFF
                        }
                    }

                    promise = promise
                    .then(_4way.read.bind(_4way, read_address, bytesToRead))
                    .then(message => {
                        if (!compare(message.params, flash_image.subarray(address, address + message.params.byteLength))) {
                            throw new Error('Failed to verify write at address 0x' + address.toString(0x10))
                        }

                        update_progress(message.params.byteLength)
                    })
                }

                return promise
            })
            // write 128 remaining bytes
            .then(() => {
                // @todo combine
                if (is_simonk) {
                    return _4way.write(0, flash_image.subarray(0, 0x40))
                    .then(message => {
                        update_progress(message.params.byteLength)
                    })
                    .then(_4way.write.bind(_4way, 0xFFFF, flash_image.subarray(0x40, 0x80)))
                    .then(_4way.read.bind(_4way, 0, 0x80))
                    .then(message => {
                        if (!compare(message.params, flash_image.subarray(0, 0x80))) {
                            throw new Error('Failed to verify write at address 0x' + message.address.toString(0x10))
                        }

                        update_progress(message.params.byteLength)
                    })
                } else {
                    return _4way.write(0, flash_image.subarray(0, 0x80))
                    .then(message => {
                        update_progress(message.params.byteLength)
                    })
                    .then(_4way.read.bind(_4way, 0, 0x80))
                    .then(message => {
                        if (!compare(message.params, flash_image.subarray(message.address, message.address + message.params.byteLength))) {
                            throw new Error('Failed to verify write at address 0x' + message.address.toString(0x10))
                        }

                        update_progress(message.params.byteLength)
                    })
                }
            })
            // write EEprom changes
            .then(() => {
                var eeprom = new Uint8Array(BLHELI_ATMEL_EEPROM_SIZE)

                // read whole EEprom
                var promise = _4way.readEEprom(0, 0x100)
                .then(message => {
                    eeprom.set(message.params, 0)
                })
                .then(_4way.readEEprom.bind(_4way, is_simonk ? 0xFFFF : 0x100, 0x100))
                .then(message => {
                    eeprom.set(message.params, 0x100)
                })
                // write differing bytes
                .then(() => {
                    var promise = Q(),
                        max_bytes_per_write = is_simonk ? 0x40 : 0x100

                    // write only changed bytes for Atmel
                    for (var pos = 0; pos < eeprom.byteLength; ++pos) {
                        var offset = pos

                        // find the longest span of modified bytes
                        while (eeprom[pos] != eeprom_image[pos] && (pos - offset) <= max_bytes_per_write) {
                            ++pos
                        }

                        // byte unchanged, continue
                        if (offset == pos) {
                            continue
                        }

                        // write span
                        promise = promise
                        .then(_4way.writeEEprom.bind(_4way, offset, eeprom_image.subarray(offset, pos)))
                    }

                    return promise
                })
            })
        }

        function check_esc_and_mcu(message) {
            esc_settings = message.params;

            // @todo ask user if he wishes to continue

            // check LAYOUT
            var target_layout = esc_settings.subarray(BLHELI_LAYOUT.LAYOUT.offset, BLHELI_LAYOUT.LAYOUT.offset + BLHELI_LAYOUT.LAYOUT.size),
                fw_layout = flash_image.subarray(BLHELI_SILABS_EEPROM_OFFSET).subarray(BLHELI_LAYOUT.LAYOUT.offset, BLHELI_LAYOUT.LAYOUT.offset + BLHELI_LAYOUT.LAYOUT.size);

            if (!compare(target_layout, fw_layout)) {
                var target_layout_str = buf2ascii(target_layout).trim();
                if (target_layout_str.length == 0) {
                    target_layout_str = 'EMPTY'
                }

                var msg = 'Target LAYOUT ' + target_layout_str + ' is different from HEX ' + buf2ascii(fw_layout).trim()
                if (self.ignore_inappropriate_mcu_layout) {
                    self.print(msg)
                } else {
                    throw new Error(msg)
                }
            }

            // check MCU, if it does not match there's either wrong HEX or corrupted ESC. Disallow for now
            var target_mcu = esc_settings.subarray(BLHELI_LAYOUT.MCU.offset, BLHELI_LAYOUT.MCU.offset + BLHELI_LAYOUT.MCU.size),
                fw_mcu = flash_image.subarray(BLHELI_SILABS_EEPROM_OFFSET).subarray(BLHELI_LAYOUT.MCU.offset, BLHELI_LAYOUT.MCU.offset + BLHELI_LAYOUT.MCU.size);
            if (!compare(target_mcu, fw_mcu)) {
                var target_mcu_str = buf2ascii(target_mcu).trim();
                if (target_mcu_str.length == 0) {
                    target_mcu_str = 'EMPTY'
                }

                var msg = 'Target MCU ' + target_mcu_str + ' is different from HEX ' + buf2ascii(fw_mcu).trim()
                if (self.ignore_inappropriate_mcu_layout) {
                    self.print(msg)
                } else {
                    throw new Error(msg)
                }
            }

            // @todo check NAME for **FLASH*FAILED**
        }

        function write_eeprom_safeguard() {
            esc_settings.set(ascii2buf('**FLASH*FAILED**'), BLHELI_LAYOUT.NAME.offset)

            var promise = _4way.write(BLHELI_SILABS_EEPROM_OFFSET, esc_settings)
            .then(function(message) {
                return _4way.read(message.address, BLHELI_LAYOUT_SIZE)
            })
            .then(function(message) {
                if (!compare(esc_settings, message.params)) {
                    throw new Error('Failed to verify write **FLASH*FAILED**')
                }
            })

            return promise
        }

        function write_bootloader_failsafe() {
            var ljmp_reset = new Uint8Array([ 0x02, 0x19, 0xFD ]),
                ljmp_bootloader = new Uint8Array([ 0x02, 0x1C, 0x00 ])

            var promise = _4way.read(0, 3)
            // verify LJMP reset
            .then(function(message) {
                if (!compare(ljmp_reset, message.params)) {
                    self.print('ESC ' + (escIdx + 1) + ' has a different instruction at start of address space, previous flashing has probably failed')
                }
            })
            // erase second page
            .then(erase_page.bind(undefined, 1))
            // write LJMP bootloader
            .then(function() {
                return _4way.write(0x200, ljmp_bootloader)
            })
            // read LJMP bootloader
            .then(function() {
                return _4way.read(0x200, ljmp_bootloader.byteLength)
            })
            // verify LJMP bootloader
            .then(function(message) {
                if (!compare(ljmp_bootloader, message.params)) {
                    throw new Error('Failed to verify `LJMP bootloader` write')
                }
            })
            // erase first page
            .then(erase_page.bind(undefined, 0))
            // ensure page erased to 0xFF
            .then(_4way.read.bind(_4way, 0, 0x100))
            .then(function(message) {
                var erased = message.params.every(x => x == 0xFF)
                if (!erased) {
                    throw new Error('Failed to verify erasure of the first page')
                }

                return _4way.read(0x100, 0x100)
            })
            .then(function(message) {
                var erased = message.params.every(x => x == 0xFF)
                if (!erased) {
                    throw new Error('Failed to verify erasure of the first page')
                }
            })

            return promise
        }

        function erase_pages(from_page, max_page) {
            var promise = Q()

            for (var page = from_page; page < max_page; ++page) {
                promise = promise.then(_4way.pageErase.bind(_4way, page))
                .then(function() {
                    update_progress(BLHELI_SILABS_PAGE_SIZE)
                })
            }

            return promise;
        }

        function erase_page(page) {
            return erase_pages(page, page + 1);
        }

        function write_pages(begin, end) {
            var begin_address   = begin * BLHELI_SILABS_PAGE_SIZE,
                end_address     = end * BLHELI_SILABS_PAGE_SIZE,
                step            = 0x100,
                promise         = Q()

            for (var address = begin_address; address < end_address; address += step) {
                promise = promise.then(_4way.write.bind(_4way, address, flash_image.subarray(address, address + step)))
                .then(function() {
                    update_progress(step)
                })
            }

            promise = promise.then(function() {
                return verify_pages(begin, end)
            })
            
            return promise
        }

        function write_page(page) {
            return write_pages(page, page + 1)
        }

        function verify_pages(begin, end) {
            var begin_address   = begin * BLHELI_SILABS_PAGE_SIZE,
                end_address     = end * BLHELI_SILABS_PAGE_SIZE,
                step            = 0x100,
                promise         = Q()

            for (var address = begin_address; address < end_address; address += step) {
                promise = promise.then(_4way.read.bind(_4way, address, step))
                .then(function(message) {
                    if (!compare(message.params, flash_image.subarray(message.address, message.address + message.params.byteLength))) {
                        throw new Error('Failed to verify write at address 0x' + message.address.toString(0x10))
                    }

                    update_progress(message.params.byteLength)
                })
            }

            return promise
        }

        function on_failed(error) {
            var elapsed_sec = (Date.now() - start_timestamp) * 1.0e-3

            self.print('Firmware flashing failed ' + (error ? ': ' + error.stack : ' ') + ' after ' + elapsed_sec + ' seconds');
            $('a.connect').removeClass('disabled')
            progress_e.hide();

            var first_esc_available = self.esc_metainfo.findIndex(function(item) {
                return item.available
            })

            update_settings_ui(first_esc_available)
        }

        function on_finished() {
            var elapsed_sec = (Date.now() - start_timestamp) * 1.0e-3

            self.print('Flashing firmware to ESC ' + (escIdx + 1) + ' finished in ' + elapsed_sec + ' seconds');
            $('a.flash, a.connect').removeClass('disabled')
            progress_e.hide();
        }
    }

    // ask the FC to switch into 4way interface mode
    MSP.send_message(MSP_codes.MSP_SET_4WAY_IF, null, null, load_html);
};

TABS.esc.cleanup = function (callback) {
    if (!CONFIGURATOR.connectionValid || !CONFIGURATOR.escActive) {
        if (callback) callback();
        return;
    }

    this.esc_settings = []
    this.esc_metainfo = []

    // tell 4-way interface to return control to MSP server
    _4way.exit()
    // now we can return control to MSP or CLI handlers
    .then(() => CONFIGURATOR.escActive = false)
    .done()

    if (callback) {
        GUI.timeout_add('waiting_4way_if_exit', callback, 100);
    }
};
