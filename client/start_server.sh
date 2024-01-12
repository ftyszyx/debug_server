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
# docker run --name debug_client  -p 9001:80 -v ./deploy/nginx/nginx.conf:/etc/nginx/nginx.conf:ro --restart always -d debug_client  
docker run --name debug_client  -p 9001:80 -v ./deploy/nginx/nginx.conf:/etc/nginx/nginx.conf:ro  -d debug_client  