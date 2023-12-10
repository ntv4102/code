<?php
	require_once ("../BackEnd/ConnectionDB/DB_classes.php");

	if(!isset($_POST['request']) && !isset($_GET['request'])) die();

	session_start();

	switch ($_POST['request']) {
		case 'dangnhap':
			dangNhap();
			break;

		case 'dangxuat':
			dangXuat();
			break;

		// case 'dangky':
		// 	dangKy();
		// 	break;

		case 'getCurrentUser':
			if(isset($_SESSION['currentUser'])) {
				die (json_encode($_SESSION['currentUser']));
			}
			die (json_encode(null));
			break;
		
		default:
			# code...
			break;
	}

	

	function dangNhap() {
		$taikhoan=$_POST['data_username'];
		$matkhau=$_POST['data_pass'];
		$matkhau=md5($matkhau);

		$sql = "SELECT * FROM nguoidung WHERE TaiKhoan='$taikhoan' AND MatKhau='$matkhau' AND MaQuyen=1 AND TrangThai=1";
		$result = (new DB_driver())->get_row($sql);

		if($result != false){
		    $_SESSION['currentUser']=$result;
		    die (json_encode($result)); 
		}  
		die (json_encode(null));
	}

	function dangXuat() {
		if(isset($_SESSION['currentUser'])) {
			unset($_SESSION['currentUser']);
			die ("ok");
		}
		die ("no_ok");
	}
?>