exports.get = function(req, res) {

	var name = 'Guest';
	var statement = 'Hi ' + name + '! Welcome to Joseph\'s App';

    res.render('pages/index', {
        statement: statement
    });

};