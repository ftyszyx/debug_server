## ref

## Description
### 需求：
1. 可以列出：通过socket连接过的设备列表：ip地址，guid,设备类型，设备名，连接状态：连上还是没连上
1.  点一个连上的设备，可以弹出对话框，通过socket.io和服务器聊天
1. 聊天命令发送到服务器，服务器再将命令转发给设备
1.  增加一个日志表，记录所有与服务器的交互.

   客户端与服务端的交互
   ```
   client_req
   {
     cmd:string
     data:key=value 空格分隔
   }
``` 

```
   server_req{
     cmd:string  第一个空格前的
     param:string  第一个空格之后的所有内容
   }
```

```
   client_resp string
   
   client第一次连上会发送：个人信息
   cmd:set 
   data:key=value 空格分隔
```
   
   
   
## author
- Author - [yuxin.zhang]()

## License

Nest is [MIT licensed](LICENSE).
