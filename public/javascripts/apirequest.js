function apiRequest(parts, fields, params, values, type) {
    this.parts = parts;
    this.fields = fields;
    this.params = params;
    this.values = values;
    this.type = type;


    this.generateQuery = generateQuery;
    function generateQuery() {
        var url = "https://www.googleapis.com/youtube/v3/";

        var sParts = "/?part=" + parts[0];
        for (var i = 1; i < parts.length; i++) {
            sParts += "," + parts[i];
        }

        var sFields = "&fields=";
        getFieldString(fields);
        function getFieldString(fields) {
            if (fields.vals[0]) sFields += fields.vals[0];
            for (var i = 1; i < fields.vals.length; i++) {
                sFields += "," + fields.vals[i];
            }
            for (var objName in fields) {
                if (fields.hasOwnProperty(objName) && objName != "vals") {
                    if (fields.vals[0]) {
                        sFields += "," + objName + "(";
                    } else {
                        sFields += objName + "(";
                    }
                    getFieldString(fields[objName]);
                    sFields += ")";
                }
            }
        }

        sParams = "";
        for (var i = 0; i < params.length; i++) {
            sParams += "&" + params[i] + "=" + values[i];
        }
        //sParams += "&key=" + key;

        console.log(url + type + sParts + sFields + sParams);
        return url + type + sParts + sFields + sParams;
    }
}
