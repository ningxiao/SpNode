#! /usr/bin/env bash
VIDEOPAT="/opt/www/video/hls"
FILES=""
NAME=""
echo "分片合并--------->开始"
#选项后面的冒号表示该选项需要参数
while getopts "F:N:" arg
do
	case $arg in
		F)
			FILES=$OPTARG
		;;
		N)
			NAME=$OPTARG
		;;
		?)  #当有不认识的选项的时候arg为?
			echo '传入执行参数错误'
			exit 1
		;;
  esac
done
cd $VIDEOPAT
FILES=${FILES//,/' '}
echo "将 ${FILES} 合并为 ${NAME}"
cat $FILES > "../${NAME}"
echo "分片合并--------->结束"
