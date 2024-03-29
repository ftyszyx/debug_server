/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50710
Source Host           : localhost:3306
Source Database       : admin

Target Server Type    : MYSQL
Target Server Version : 50710
File Encoding         : 65001

Date: 2024-01-16 10:36:03
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for chat_log
-- ----------------------------
DROP TABLE IF EXISTS `chat_log`;
CREATE TABLE `chat_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` text NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `from_user` varchar(255) NOT NULL DEFAULT '',
  `room_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `from_user` (`from_user`),
  KEY `room_id` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of chat_log
-- ----------------------------

-- ----------------------------
-- Table structure for chat_room
-- ----------------------------
DROP TABLE IF EXISTS `chat_room`;
CREATE TABLE `chat_room` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `users` text NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL,
  `nick` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of chat_room
-- ----------------------------
INSERT INTO `chat_room` VALUES ('1', '1,fc98f7deeb5763e8d7023dace124649cc0ca20fe', '2024-01-02 17:13:41', '1-fc98f7deeb5763e8d7023dace124649cc0ca20fe', '张雨鑫编辑器');

-- ----------------------------
-- Table structure for debug_client
-- ----------------------------
DROP TABLE IF EXISTS `debug_client`;
CREATE TABLE `debug_client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guid` varchar(255) NOT NULL,
  `os_name` varchar(50) NOT NULL,
  `desc` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `guid` (`guid`),
  KEY `system` (`os_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of debug_client
-- ----------------------------
INSERT INTO `debug_client` VALUES ('3', '张雨鑫编辑器', 'fc98f7deeb5763e8d7023dace124649cc0ca20fe', 'android', 'test');

-- ----------------------------
-- Table structure for log
-- ----------------------------
DROP TABLE IF EXISTS `log`;
CREATE TABLE `log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `info` text NOT NULL,
  `log_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `log_type` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`user_id`),
  KEY `logtype` (`log_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of log
-- ----------------------------

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sorts` tinyint(4) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `desc` text CHARACTER SET utf8mb4 NOT NULL,
  `title` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `icon_style_type` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `parent` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES ('1', '0', '1', '首页', '首页', 'icon-home', '0', '/home');
INSERT INTO `menu` VALUES ('2', '1', '1', '系统管理', '系统管理', 'icon-setting', '0', '/system');
INSERT INTO `menu` VALUES ('3', '0', '1', '系统管理/用户管理', '用户管理', 'icon-user', '2', '/system/useradmin');
INSERT INTO `menu` VALUES ('4', '1', '1', '系统管理/角色管理', '角色管理', 'icon-team', '2', '/system/roleadmin');
INSERT INTO `menu` VALUES ('5', '2', '1', '系统管理/权限管理', '权限管理', 'icon-safe', '2', '/system/poweradmin');
INSERT INTO `menu` VALUES ('6', '3', '1', '系统管理/菜单管理', '菜单管理', 'icon-menu', '2', '/system/menuadmin');
INSERT INTO `menu` VALUES ('7', '4', '1', '系统管理/日志', '系统日志', 'icon-logs', '2', '/system/log');
INSERT INTO `menu` VALUES ('21', '1', '1', '调试工具', '调试工具', 'icon-debug', '0', '/debug');
INSERT INTO `menu` VALUES ('22', '2', '1', '调试工具/命令窗口', '命令窗口', 'icon-terminal', '21', '/debug/terminal/:id');
INSERT INTO `menu` VALUES ('23', '1', '1', '调试工具/所有连接', '所有连接', 'icon-clients', '21', '/debug/clients');

-- ----------------------------
-- Table structure for power
-- ----------------------------
DROP TABLE IF EXISTS `power`;
CREATE TABLE `power` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module` varchar(50) NOT NULL,
  `sorts` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `desc` text NOT NULL,
  `status` tinyint(4) NOT NULL,
  `code` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of power
-- ----------------------------
INSERT INTO `power` VALUES ('1', 'user', '1', '新增', '新增', '1', 'add');
INSERT INTO `power` VALUES ('2', 'user', '1', '查看', '查看', '1', 'see');
INSERT INTO `power` VALUES ('3', 'user', '1', '删除', '删除', '1', 'del');
INSERT INTO `power` VALUES ('4', 'user', '1', '修改', '修改', '1', 'up');
INSERT INTO `power` VALUES ('5', 'power', '1', '新增', '新增', '1', 'add');
INSERT INTO `power` VALUES ('6', 'power', '1', '查看', '查看', '1', 'see');
INSERT INTO `power` VALUES ('7', 'power', '1', '删除', '删除', '1', 'del');
INSERT INTO `power` VALUES ('8', 'power', '1', '修改', '修改', '1', 'up');
INSERT INTO `power` VALUES ('9', 'menu', '1', '新增', '新增', '1', 'add');
INSERT INTO `power` VALUES ('10', 'menu', '1', '查看', '查看', '1', 'see');
INSERT INTO `power` VALUES ('11', 'menu', '1', '删除', '删除', '1', 'del');
INSERT INTO `power` VALUES ('12', 'menu', '1', '修改', '修改', '1', 'up');
INSERT INTO `power` VALUES ('13', 'role', '1', '新增', '新增', '1', 'add');
INSERT INTO `power` VALUES ('14', 'role', '1', '查看', '查看', '1', 'see');
INSERT INTO `power` VALUES ('15', 'role', '1', '删除', '删除', '1', 'del');
INSERT INTO `power` VALUES ('16', 'role', '1', '修改', '修改', '1', 'up');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `desc` text NOT NULL,
  `sorts` tinyint(4) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `menus` text NOT NULL,
  `powers` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('1', '超级管理员', '超级管理员', '1', '1', '', '');
INSERT INTO `role` VALUES ('2', '管理员', '管理员', '2', '1', '1,2,3,4,5,6', '9,10,14,5,6,7,8,11,12,13,15,16,1,2,3,4');
INSERT INTO `role` VALUES ('3', '普通用户', '普通用户', '1', '1', '3', '2');
INSERT INTO `role` VALUES ('4', '游客', '游客', '1', '1', '1', '');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `phone` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `desc` text NOT NULL,
  `roles` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '$2b$10$y3AoPqdwZdTd5Z4GPqeKnuohDK7uN4UkYdQ/4jKTCfjHKOnvybYri', '1', 'super', '2023-11-08 17:11:15', '', '', 'first_user', '1');
INSERT INTO `user` VALUES ('12', '$2b$10$NsxTgvhxvYH6qvPeh8QMDeutBqlpzBvVXqhOeZWDRrx9sh7TEZm2S', '1', 'guest', '2023-11-23 22:01:23', '', '', '', '4');
INSERT INTO `user` VALUES ('13', '$2b$10$GUKntAVyXy80/g5/3EZleONsrhsow5sXCg/e7QJdyvRk4NlX4yBXC', '1', 'admin', '2023-11-24 10:07:58', '', '', '', '2');
INSERT INTO `user` VALUES ('14', '$2b$10$1FjVIBmMPIJj1Eqf2Xn3weT1w8vn6W5xJd6Zwl6mKRIyETAx2LXVG', '1', 'zyx', '2023-11-24 10:08:10', '', '', '', '3');
INSERT INTO `user` VALUES ('15', '$2b$10$vNElrcIouKalQVZyLthLk.Pvoj0UDdvjKg2k3walheCxVPEBdEvF2', '1', 'test', '2023-11-25 20:15:56', '', '', '', '4');
