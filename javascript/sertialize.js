function serialize(patientData) {
  
    let returnString = "";
    let paid = "";
    let codes = "";
    
    for (count=0; count < patientData.length; count++) {
        paid = patientData[count].paid ? "Y" : "N";
        codes = (patientData[count].treatmentCodes || []).join(",")
      returnString = returnString.concat(returnString, `>${patientData[0].patientId}\n+${patientData[0].visitDate}|${paid}|${codes}`)
    }      
    return returnString;
  }
  function deserialize(patientString) {
    const lines = patientString.split("\n");
    const segments = lines[1].split("|");
    
    return [{
      patientId: lines[0].substr(1),
      visitDate: segments[0].substr(1),
      paid: (segments[1] === "Y"),
      treatmentCodes: segments[2].split(",").map(Number)
    }];
  }

  /**
   * 
   * 
   * expected        '>PI-31415\n+2018-05-31|Y|41524,9810,33179>PI-31415\n+2018-05-31|Y|41524,9810,33179>PI-31415\n+2018-05-31|N|2251' 
   * to deeply equal '>PI-31415\n+2018-05-31|Y|41524,9810,33179\n>RQ-15509\n+2018-06-09|N|2251'
   * 
   */