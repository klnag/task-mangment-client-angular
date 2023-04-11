function inputValidate(data: any,target: string, type: string) {
    console.log(isValidInputs)
    if (type === "normal") {
      if (!data[target].value) data[target].errMsg = `${target} is empty` 
      else if (data[target].value.length < 3) data[target].errMsg = `${target} is less than 3 chars`
      else data[target].errMsg = ""
    } else if(type === "email") {
      if (!data[target].value) data[target].errMsg = `${target} is empty` 
      else if (data[target].value.length < 8) data[target].errMsg = `${target} is less than 8 chars`
      else if (!emailPattern.test(data[target].value)) data[target].errMsg = `${target} must be an email`
      else data[target].errMsg = ""
    } else if(type === "password") {
      if (!data[target].value) data[target].errMsg = `${target} is empty` 
      else if (data[target].value.length < 8) data[target].errMsg = `${target} is less than 8 chars`
      else data[target].errMsg = ""
    }
    
    if(!data["username"].errMsg && !data["email"].errMsg && !data["password"].errMsg) {
      isValidInputs = true
    }