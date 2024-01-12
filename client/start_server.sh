echo "clean docker image"
need_clen_images=$(docker images -f "dangling=true" -q)
if [ -z $need_clen_images]
then
    echo "not empty images"
else
    docker rmi $need_clen_images
fi
echo "docker build"
docker build -t debug_client .
echo "run docker"
docker run -d -p 9001:80 debug_client -v ./deploy/nginx/nginx.conf:/etc/nginx/nginx.conf:ro