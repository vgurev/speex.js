function CodecProcessor (params) {
  // read the speex profile (narrow, wideband, ultra wideband)
  this.mode = libspeex.speex_lib_get_mode(params.mode || 0);

  this.params = params;

  this.opt_basename = "SPEEX_SET_";

  this.options = {};
}

CodecProcessor.prototype.set = function (name, value) {  
  if (typeof(value) === "undefined" || value === null) {
    return;
  }

  this.options[name] = value;
  
  var ptr = libspeex.allocate(1, 'i32', ALLOC_STACK), conv;  
  
  if (value.constructor == Number.prototype.constructor) {
    conv = parseInt(value);
  }

  if (value.constructor == Boolean.prototype.constructor) {
    conv = (!!value ? 1 : 0);
  }

  setValue(ptr, conv || 0, 'i32');
  flag = this.opt_basename + name.toUpperCase().replace(" ", "_");

  console.log("%s: %d", flag, conv);  
  Speex[flag] && libspeex.speex_encoder_ctl(this.state, Speex[flag], ptr);

  if (name == "quality") {
    this.bits_size = SpeexEncoder.quality_bits[conv];
  }
}

/**
  * Temporary buffers
  */
CodecProcessor.prototype.buffer = null;

/**
  * Input buffers
  */
CodecProcessor.prototype.input = null;

/**
  * Encoded/Decoded audio frames
  */
CodecProcessor.prototype.output = null;

/**
  * libspeex internal state
  */
CodecProcessor.prototype.state = null;

/**
  * SpeexBits for use in the libspeex routines
  */
CodecProcessor.prototype.bits = null;