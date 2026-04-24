const bcrypt = require("bcryptjs");
bcrypt.hash("22173-cm-004", 10).then(function(hash) {
    console.log(hash);
});