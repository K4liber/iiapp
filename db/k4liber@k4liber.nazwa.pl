-- MySQL dump 10.13  Distrib 5.5.54, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: iidb
-- ------------------------------------------------------
-- Server version	5.5.54-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comment` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `memId` int(6) NOT NULL,
  `authorNickname` varchar(50) NOT NULL,
  `authorPhoto` varchar(100) NOT NULL,
  `content` varchar(2000) DEFAULT NULL,
  `dateTime` varchar(50) NOT NULL,
  `points` int(6) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (2,1,'janbielecki94','http://46.41.136.25:8080/resources/avatars/janbielecki94.jpeg','This is not for family to live and gathering things but for spend some night on holiday or season work. Batteries keeps energy from photovoltanic panels, izolated water keeps energy from solar panels. Walls are isolated to keep suitable temperature. You have place for sleep, eat, take shower and make shit.','2017-04-13T22:56:45+02:00',1),(3,2,'janbielecki94','http://46.41.136.25:8080/resources/avatars/janbielecki94.jpeg','By robot language translator I mean programmer. Other proffesions (which contains job have to be done for living) will be perform by robots. Programmers will be speak to them what to do. People will be only making art, love, feed the senses and do science. I hope robots never will be such intelligent to take control by themselves.','2017-04-13T23:44:05+02:00',2),(6,4,'janbielecki94','http://46.41.136.25:8080/resources/avatars/janbielecki94.jpeg','So much controversy about referee decisions. They consider to enter replay system (VAR - Video Assistant Referee). I was thinking about algoritm which will be analyzing the match in real time. It will be much faster and same for everyone.','2017-04-21T17:00:44+02:00',1),(16,19,'janbielecki94','http://46.41.136.25:80/app/resources/avatars/janbielecki94.jpeg','The earth moon reflects less than 10% of the sunlight. For example one of the Saturn moons (which is almost all covered with ice) reflects 99% of the sunlight. If we cover the earth moon with well reflecting thing it will be 10 times stronger moon shining. During the full moon it would be really brightly.','2017-04-28T12:05:43+02:00',0),(17,20,'janbielecki94','http://46.41.136.25:80/app/resources/avatars/janbielecki94.jpeg','The richest nations spend huge sums of money for militaries (in 2014, the USA allocated $571 billion for this purpose). If they spend this money for future energy power station (solar power plants and innovative nuclear fusion equipment) there will be enough energy for everyone and war would not be necessary.','2017-04-28T12:20:40+02:00',0),(18,21,'janbielecki94','http://46.41.136.25:80/app/resources/avatars/janbielecki94.jpeg','When I program I just find another issue and find a solution. Then I have to write a code... This is the most boring part. But wait, solution is already in my head! It will be so smooth programing without writing code, just using your brain. It would require translating thoughts into machine language but it seems to be the way to go. Neuralink (company founded by Elon Musk) works on this field of technology.','2017-04-28T12:43:07+02:00',0),(24,25,'janbielecki94','http://46.41.136.25:80/app/resources/avatars/janbielecki94.jpeg','In the begging of the universe small particles as quarks merged in hadrons, then atoms where formed. The next stage is the formation of simple chemical compounds and the first living organisms are formed. A man evolved to form a civilization. Now our civilization as the next stage in the evolution of the universe will settle planets and maybe cooperate with others civilizations, for example, by exchanging technologies. We are like stem cells (we have unlimited multiplication and differentation) in the body of an organism which is our civilization.','2017-04-30T12:07:42+02:00',0),(30,27,'janbielecki94','http://46.41.136.25:80/resources/avatars/janbielecki94.jpeg','Application that allows people to add any new event and others to join it. Something like events on facebook, but you make events not to your friends or concrete users but for all who meet your criteria e.g. gender, age, interests, skills, hobbies, time, place. You can look for events also using your own criteria.','2017-05-09T11:41:30+02:00',0),(32,26,'janbielecki94','http://46.41.136.25:80/resources/avatars/janbielecki94.jpeg','There are so many movies about aliens come to Earth, but I did not see any about people going to others planets and met another life or less developed civilization e.g. reptile civilization or dinosaurs. Would you like to see such a movie?','2017-05-09T14:45:38+02:00',0),(34,29,'janbielecki94','http://46.41.136.25:80/resources/avatars/janbielecki94.jpeg','3D city map including all objects with textures for better insign into the city, and better management of the city. Drones connected to the network will be do the measurements with IR and pictures as textures. Data from drones will be processed in order to achieve full three-dimensional model of the city.','2017-05-10T10:49:39+02:00',1),(37,30,'janbielecki94','http://46.41.136.25:80/resources/avatars/janbielecki94.jpeg','If you don\'t know what to wear for the evening or which of you is more beautiful you can just add photos and ask the public - all or categorized people or send query to specific people. Or question like: Who will win the election? To see the answers you must vote. Application can make charts from data, you can see how categorized group of people voted. You can vote anonymously, but when you make chart your data like age can count.','2017-05-11T21:13:21+02:00',0),(39,31,'janbielecki94','http://46.41.136.25:80/resources/avatars/janbielecki94.jpeg','You make accounts in a few online bookmakers and send some of money each of them. Then your algorithm download data with matches odds and if for example odd for win first team (1) is bigger than 2.00 and in another bookmaker the odd for X2 is bigger than 2.00 for the same match you put the same amount of money on each of them and you have a guaranteed profit.','2017-05-14T22:29:11+02:00',0),(40,32,'janbielecki94','http://46.41.136.25:80/resources/avatars/janbielecki94.jpeg','I have studied a bit about quantum entanglement, and I have a riddle for quantum teleportation for you: I have two cubes: one is red and the other is blue. I hold them in the hand and I give you one of them, but I do not know which, you also do not know. About the state of the whole system (two cubes) we know that these are two cubes - one red, the other blue (it is for sure - 100%). But with the one-cube subsystem, we only know that it\'s a red or blue cube (50% for every option). A typical entanglement system. At the time of the measurement (you check the color of your cube - it is blue) you already know what color my cube is - it is quantum \"teleportation\" - you gave the color for my cube at the time of measurement. Question: Is it possible to measure by which I gave you the same cube and it would turn out red? PS. Cubes can not change color during the experiment.','2017-05-16T22:13:10+02:00',0),(45,3,'janbielecki94','http://46.41.136.25:80/resources/avatars/janbielecki94.jpeg','So many ideas arise in our brains and just goes away. Visionaries - do not let them die by sharing your visions with the world. If you get an idea and you think it could be some innovation or some vision of the future, something that does not exist or just some thought experiment, or you found something innovative on the internet - we are waiting for you to share with us. To share your vision just click Upload icon in the upper right corner. You have to log in to upload your idea. Each vision has a category assigned to it that allows the selection of the vision area. All content is public so you can of course read, comment and like other people\'s visions. Cheers!','2017-05-19T10:17:32+02:00',0);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commentPoint`
--

DROP TABLE IF EXISTS `commentPoint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commentPoint` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `commentId` int(6) NOT NULL,
  `authorNickname` varchar(50) NOT NULL,
  `dateTime` varchar(50) NOT NULL,
  `memId` int(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commentPoint`
--

LOCK TABLES `commentPoint` WRITE;
/*!40000 ALTER TABLE `commentPoint` DISABLE KEYS */;
INSERT INTO `commentPoint` VALUES (4,3,'marekbielecki93','2017-04-15T12:52:49+02:00',2),(48,2,'janbielecki94','2017-04-20T18:21:59+02:00',1),(49,3,'janbielecki94','2017-04-21T15:48:50+02:00',2),(53,6,'janbielecki94','2017-04-27T00:44:04+02:00',4),(56,34,'janbielecki94','2017-05-14T17:49:04+02:00',29);
/*!40000 ALTER TABLE `commentPoint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mem`
--

DROP TABLE IF EXISTS `mem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mem` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `signature` varchar(100) NOT NULL,
  `imgExt` varchar(10) NOT NULL,
  `dateTime` varchar(50) DEFAULT NULL,
  `authorNickname` varchar(50) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `points` int(6) DEFAULT '0',
  `views` int(6) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mem`
--

LOCK TABLES `mem` WRITE;
/*!40000 ALTER TABLE `mem` DISABLE KEYS */;
INSERT INTO `mem` VALUES (1,'Mini self-contained cottages with heat and electricity from sun, and filtered groundwater','.jpeg','2017-04-13T22:38:38+02:00','janbielecki94','people',1,162),(2,'In the near future there will be probably only one proffesion - robot language translator','.jpeg','2017-04-13T23:44:05+02:00','janbielecki94','another',2,495),(3,'So many ideas arise in our brains and just goes away...','.png','2017-04-21T16:14:10+02:00','janbielecki94','another',1,200),(4,'Algorithm for refereeing football matches','.jpeg','2017-04-21T17:00:44+02:00','janbielecki94','entertainment',1,83),(19,'10 times stronger moon shining','.jpeg','2017-04-28T12:05:43+02:00','janbielecki94','science',0,11),(20,'Pure energy instead of war','.jpeg','2017-04-28T12:20:40+02:00','janbielecki94','economy',0,12),(21,'Programming without writing code','.jpeg','2017-04-28T12:43:07+02:00','janbielecki94','science',0,38),(25,'Our civilization as a next stage in evolution of the universe','.jpeg','2017-04-30T12:07:42+02:00','janbielecki94','people',0,19),(26,'Movie about people as aliens on other planets','.jpeg','2017-05-02T00:25:05+02:00','janbielecki94','media',0,13),(27,'Application for spending time together','.png','2017-05-03T00:17:07+02:00','janbielecki94','people',1,40),(29,'Making 3D city map by skanning drones','.jpeg','2017-05-10T10:49:07+02:00','janbielecki94','another',0,32),(30,'Application to consult the public','.jpeg','2017-05-11T21:12:36+02:00','janbielecki94','people',0,57),(31,'Algorithm to win at bookmakers','.jpeg','2017-05-14T22:29:11+02:00','janbielecki94','entertainment',0,50),(32,'Quantum \"teleportation\"','.png','2017-05-16T22:13:10+02:00','janbielecki94','science',1,168);
/*!40000 ALTER TABLE `mem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memPoint`
--

DROP TABLE IF EXISTS `memPoint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `memPoint` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `memId` int(6) NOT NULL,
  `authorNickname` varchar(50) NOT NULL,
  `dateTime` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memPoint`
--

LOCK TABLES `memPoint` WRITE;
/*!40000 ALTER TABLE `memPoint` DISABLE KEYS */;
INSERT INTO `memPoint` VALUES (1,1,'janbielecki94','2017-04-13T22:39:22+02:00'),(2,2,'marekbielecki93','2017-04-15T12:47:55+02:00'),(26,2,'janbielecki94','2017-04-21T15:38:50+02:00'),(29,3,'janbielecki94','2017-04-23T18:12:07+02:00'),(31,4,'janbielecki94','2017-04-23T18:57:31+02:00'),(34,27,'janbielecki94','2017-05-09T11:27:45+02:00'),(36,32,'janbielecki94','2017-05-17T11:56:38+02:00');
/*!40000 ALTER TABLE `memPoint` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-05-22 10:26:48
