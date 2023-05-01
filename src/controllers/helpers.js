async function  enrichedUsers  (table) {
    console.log("table.enrichedUsers");

    return new Promise((res, rej) => {
        let tableToSend = {
            _id : table._id,
            name : table_name,
            users : []
          };
        let enrichedUsers = []
        try {
        table.users.forEach((player) => {
            User.findOne({ _id: player }).then((user) => {
            enrichedUsers.push({
                _id : user._id, 
                pseudo : user.pseudo, 
                login : user.login,
                status : user.status
                });
            })
        })
        tableToSend.users = enrichedUsers;
        res(tableToSend)
        } catch (err) {
        throw err;
        }
    }) 
  }

module.exports.enrichedUsers = enrichedUsers;