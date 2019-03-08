/**
 * 设备信息，程序版本
 * @type {{appCode: string, appVersion: string, deviceType: number, deviceId: string, deviceOS: string}}
 */
const state = {
    appCode: `SupplyChainSAAS`,
    appVersion: `1.0.0`,
    deviceType: 3,
    deviceId: ``,
    deviceOS: ``,
  };

const getters = {};

const mutations = {
  setAppVersion(state, version) {
    state.appVersion = version
  },
  setDeviceId(state, id) {
    state.deviceId = id
  },
  setDeviceOS(state, deviceOS) {
    state.deviceOS = deviceOS
  },
};

const actions = {
  getVersionInfo({state, commit}) {
    //初始化deviceId
    console.log(localStorage)
    let deviceId = localStorage.getItem(`deviceId`)
    if (!deviceId) {
      deviceId = uuid(16, 16)
      localStorage.setItem(`deviceId`, deviceId)
    }
    commit(`setDeviceId`, deviceId)
    //初始化deviceOS
    let deviceOS = localStorage.getItem(`deviceOS`)
    if (!deviceOS) {
      deviceOS = navigator.appVersion
      localStorage.setItem(`deviceOS`, deviceOS)
    }
    commit(`setDeviceOS`, deviceOS)
    return {
      appCode: state.appCode,
      appVersion: state.appVersion,
      deviceType: state.deviceType,
      deviceId: state.deviceId,
      deviceOS: state.deviceOS,
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

/**
 *
 * @param len
 * @param radix
 * @returns {string}
 */
function uuid(len, radix) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data. At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
  // 8 character ID (base=2)
  //   uuid(8, 2) // "01001010"
  // 8 character ID (base=10)
  //   uuid(8, 10) // "47473046"
  // 8 character ID (base=16)
  //   uuid(8, 16) // "098F4D35"
}
