# echo "clean docker image"
# need_clen_images=$(docker images -f "dangling=true" -q)
# if [ -z $need_clen_images]
# then
#     echo "not empty images"
# else
#     docker rmi $need_clen_images
# fi
echo "docker build"
docker-compose build
echo "docker run"
docker-compose up -d