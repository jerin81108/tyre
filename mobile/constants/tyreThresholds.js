// constants/tyreThresholds.js
// Central tyre threshold configuration - change these values here ONLY

const tyreThresholds = {
  RECOMMENDED_PRESSURE: 100, // PSI

  PRESSURE_STATUS: {
    GOOD_MIN: 90,       // 90-100 = Good
    WARNING_MIN: 75,    // 75-89 = Warning
    // Below 75 = Critical
  },

  TREAD_STATUS: {
    GOOD_MIN: 70,       // 70-100% = Good
    WARNING_MIN: 50,    // 50-69% = Warning
    // Below 50% = Critical
  },
};

module.exports = tyreThresholds;
