module.exports = function (app, connection, P) {

    var bcrypt = require("bcrypt-nodejs");

    app.post('/add2BattleHistory', function(req, res) {
        var bid = req.body.bid;
        var uid = parseInt(req.body.uid);
        var result = req.body.result;

        connection.query('CALL addBattleHistory(' + bid + ", " + uid + ", " + result + ');',function(err, rows) {
            if (err) {
                res.sendStatus(400)
            }
            res.json(rows)
        })
    });

    app.get('/getRandomTeam', function(req, res) {
        var poke_1 = 1;
        var poke_2 = 1;
        var poke_3 = 1;
        while (poke_1 === poke_2 || poke_1 === poke_3 || poke_2 === poke_3) {
            poke_1 = Math.floor((Math.random() * 721) + 1);
            poke_2 = Math.floor((Math.random() * 721) + 1);
            poke_3 = Math.floor((Math.random() * 721) + 1);
        }
        connection.query('CALL generateRandomTeam(' + poke_1 + ", " + poke_2 + ", " + poke_3 + ');',function(err,rows) {
            if (err) {
                res.sendStatus(404)
            }
            res.json(rows)
        })
    });


    app.post('/add2Team', function(req, res) {
        var ownsId = req.body.ownsId;
        var userId = req.body.userId;
        connection.query('CALL update_favirote(' + userId + ", " + ownsId + ');',function(err,rows) {
            if (err) {
                res.sendStatus(404)
            }
            res.json(rows)
        })
    });

    app.post('/generateAPokemon', function(req, res) {
        var uid = req.body.uid;
        var pid = req.body.pid;
        var userTier = req.body.userTier;

        var randomHP = Math.random();
        if (randomHP < 0.5) {
            randomHP -= 1;
        } else {
            randomHP -= 0.5;
        }
        var b_hp = Math.floor(randomHP * 10) + (userTier * 10);

        var randomAttack = Math.random();
        if (randomAttack < 0.5) {
            randomAttack -= 1;
        } else {
            randomAttack -= 0.5;
        }
        var b_attack = Math.floor(randomAttack * 10) + (userTier * 10);

        var randomDefense = Math.random();
        if (randomDefense < 0.5) {
            randomDefense -= 1;
        } else {
            randomDefense -= 0.5;
        }
        var b_defense = Math.floor(randomDefense * 10) + (userTier * 10);

        var randomSA = Math.random();
        if (randomSA < 0.5) {
            randomSA -= 1;
        } else {
            randomSA -= 0.5;
        }
        var b_sa = Math.floor(randomSA * 10) + (userTier * 10);

        var randomSD = Math.random();
        if (randomSD < 0.5) {
            randomSD -= 1;
        } else {
            randomSD -= 0.5;
        }
        var b_sd = Math.floor(randomSD * 10) + (userTier * 10);

        var randomSPEED = Math.random();
        if (randomSPEED < 0.5) {
            randomSPEED -= 1;
        } else {
            randomSPEED -= 0.5;
        }
        var b_speed = Math.floor(randomSPEED * 10) + (userTier * 10);
        var temp_attack;
        var temp_defense;
        if (b_sa < b_attack) {
            temp_attack = b_attack;
            b_attack = b_sa;
            b_sa = temp_attack;
        }
        if (b_sd < b_defense) {
            temp_defense = b_defense;
            b_defense = b_sd;
            b_sd = temp_defense;
        }

        connection.query('CALL add_new_own(' + uid + ", " + pid + ", " + b_hp + ", " + b_attack + ", " + b_defense +
            ", " + b_sa + ", " + b_sd + ", " + b_speed + ');',function(err,rows) {
            if (err) {
                res.sendStatus(404)
            }
            res.json(rows)
        })


    });

    app.post('/initUserBattleTeam', function(req, res) {
        var userId = req.body.userId;
        connection.query('CALL get_favorite_pokemon_by_uid(' + userId + ');',function(err,rows) {
            if (err) {
                res.sendStatus(404)
            }
            res.json(rows)
        })
    });

    app.post('/initUserPokemons', function(req, res) {
        var userId = req.body.userId;
        connection.query('CALL get_pokemon_by_uid(' + userId + ');',function(err,rows) {
            if (err) {
                res.sendStatus(404)
            }
            res.json(rows)
        })
    });

    app.post('/userLogin', function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        connection.query('CALL get_user_by_name(' + "'" + username + "'" + ');', function (err, rows) {
             if (err) {
                 res.sendStatus(404)
             }
             if (rows[0].length === 0) {
                 res.sendStatus(404)
             } else {
                 if (bcrypt.compareSync(password, rows[0][0].user_password)) {
                     res.json(rows)
                 } else {
                     res.sendStatus(404)
                 }
             }
         })
    });


    app.post('/getUserById', function (req, res) {
        var uid = req.body.userId;
        connection.query('CALL get_user_by_id(' + uid + ');',function(err,rows) {
            if (err) {
                res.sendStatus(404)
            }
            res.json(rows)
        })
    });


    app.post('/getPokemonByType', function (req, res) {
        var type = req.body.poke_type;
        var typeList = ['fire', 'grass', 'fighting', 'water', 'psychic', 'electric', 'normal', 'ice', 'poison', 'ground', 'flying',
                        'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']
        if (typeList.includes(type)) {
            connection.query('CALL getAllTypes(' + "'" + type + "'" + ');', function (err, rows) {
                 if (err) {
                     res.sendStatus(404)
                 }
                 res.json(rows)
             })
        } else {
            if (parseInt(type) == type) {
                connection.query('CALL getInforTableById(' + "'" + type + "'" + ');', function (err, rows) {
                     if (err) {
                         res.sendStatus(404)
                     }
                     res.json(rows)
                 })
            } else {
                connection.query('CALL getInforTableByName(' + "'" + type + "'" + ');', function (err, rows) {
                     if (err) {
                         res.sendStatus(404)
                     }
                     res.json(rows)
                 })
            }
        }

    });

    app.post('/registeration', function(req, res) {
        var username = req.body.username;
        var password = bcrypt.hashSync(req.body.password);
        // password = req.body.password;
        connection.query('CALL regisration(' + "'" + username + "', " + "'" + password + "'" + ');',function(err,rows) {
            if (err) {
                res.sendStatus(404)
            }
            res.json(rows)
        })
    });

    app.delete('/deletePokemon/:ownsId', function (req, res) {
        var oid = req.params['ownsId']
        connection.query('CALL delete_pokemon(' + oid + ');', function (err, rows) {
            if (err) {
                res.sendStatus(404)
            }
            res.sendStatus(200)
        })
    })

    app.get('/searchBerry', function (req, res) {
        connection.query('CALL getAllBerries();', function (err, rows) {
             if (err) {
                 res.sendStatus(404)
             }
             res.json(rows)
         })
    })
}
