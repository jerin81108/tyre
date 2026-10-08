const tyreThresholds = {
  RECOMMENDED_PRESSURE: 100,
  
  PRESSURE_STATUS: {
    GOOD_MIN: 90,
    WARNING_MIN: 75
    // Below 75 is Critical
  },
  
  TREAD_STATUS: {
    GOOD_MIN: 70,
    WARNING_MIN: 50
    // Below 50 is Critical
  }
};

module.exports = tyreThresholds;
