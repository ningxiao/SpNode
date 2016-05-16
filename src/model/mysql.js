"use strict";
const mysql = require('mysql');
const db = require('../config/db');
const pool = mysql.createPool(db.mysql);

function getConnection(sql, json, callback) {
	pool.getConnection(function(err, conn) {
		if (!err) {
			conn.query(sql, json, function(err, results) {
				conn.release();
				callback(err, results);
			});
			return;
		}
		conn.release();
		callback(err, null);
	});
}
exports.pool = getConnection;