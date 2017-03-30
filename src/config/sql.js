module.exports = {
	"WHERE_USER": "SELECT * FROM user WHERE id = ?",
	"UPDATE_VIDEO": "UPDATE video SET status=?, path=? WHERE id = ?",
	"WHERE_VID": " SELECT a.id,a.name,a.status,b.name as stname,b.vindex FROM video a,video_slice b WHERE a.id =? and b.vid = ? ORDER  BY b.vindex"
};