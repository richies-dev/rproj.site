// Dependency check supplied data, force structure of data

class DataValidator {

  
  constructor(data, errorHandler) {

    this.data         = data;
    this.errorHandler = errorHandler;

    this.requiredFields = [
      "slug",
      "title"
    ];

    var self = this;

    Object.keys(this.data).forEach(key => {

      const itemList = self.data[key];
      Object.keys(itemList).forEach(key => {

        const item    = itemList[key];
        const fields  = self._validateItemFields(item);

        //Add error if missing fields array is not empty
        if(fields.length > 0){
          fields.forEach(field => {

            if(item.title){
              self.errorHandler.add(item.title + " - Missing Field, '" + field + "'.");
            }else if(item.slug){
              self.errorHandler.add(item.slug + " - Missing Field, '" + field + "'.");
            }else{
              self.errorHandler.add(JSON.stringify(item) + " - Object Missing Field, '" + field + "'.");
            }

          });
        }
        
      });
    });
  }

  _validateItemFields(item){

    var missingFields = [];

    this.requiredFields.forEach(requiredField => {
      if(item.hasOwnProperty(requiredField)) 
      {

      } else {
        missingFields.push(requiredField);
      }
    });

    return missingFields;
  }

  get validatedData(){
    return this.data;
  }

}

exports.DataValidator = DataValidator;