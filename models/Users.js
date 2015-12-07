/**
 * Created by izabela on 6/12/15.
 */
var mongoose = require ('mongoose');


var userSchema = mongoose.Schema ({
    name : {type: String, required: true},
    email : {type: String, required: true, unique:true, index: true},
    sendReport : {type: Boolean, required: true, default: false}
});


var User = mongoose.model('Users', userSchema);
module.exports = User;