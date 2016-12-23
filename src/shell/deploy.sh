#! /usr/bin/env bash
ZIPPATH="/opt/www/www.ningxiao.com"
TYPE=""
ZIPNAME="dest.zip"
CURTIME=`date "+%Y-%m-%d %H:%M:%S"`
echo "开始执行自动部署${CURTIME}"
#选项后面的冒号表示该选项需要参数
while getopts "T:N:" arg
do
	case $arg in
		T)
			TYPE=$OPTARG
		;;
		N)
			ZIPNAME=$OPTARG
		;;
		?)  #当有不认识的选项的时候arg为?
			echo '传入执行参数错误'
			exit 1
		;;
  esac
done
cd $ZIPPATH
#进行对应逻辑判断
case $TYPE in
    "ls")
    	echo "查看文件目录"
	ls -R
    ;;
    "backup")
	echo "执行文件备份${CURTIME}.zip"
        cp $ZIPNAME "backup/${CURTIME}.zip"
    ;;
    "clean")
    	echo '执行文件清理'
    	rm -rf images/ script/ css/
    	ls -R
    ;;
    "zip")
	echo '执行文件清理与解压缩'
	if [ -f "${ZIPPATH}/${ZIPNAME}" ];
	then
		rm -rf images/ script/ css/
		unzip -o $ZIPNAME
		ls -R
		echo "清理与解压${ZIPNAME}成功"
	else
		ls -R
		echo '解压文件不存在'
	fi
    ;;
    *)  echo '未知指令'
    ;;
esac
