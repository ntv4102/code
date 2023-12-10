var currentUser;
var tongTienTatCaDonHang = 0; // lưu tổng tiền từ tất cả các đơn hàng đã mua
var tongSanPhamTatCaDonHang = 0;

window.onload = function() {
    khoiTao();

    // thêm tags (từ khóa) vào khung tìm kiếm
    var tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
    for (var t of tags) addTags(t, "index.php?search=" + t);

    getCurrentUser((data) => {
        if (data) {

            $.ajax({
                type: "GET",
                url: "php/tabledonhang.php",
                success: function(data) {
                    $(".listDonHang").html(data);
                },
                error: function(e) {
                    console.log(e.responseText);
                }
            })

        } else {
            var warning = `<h2 style="color: red; font-weight:bold; text-align:center; font-size: 2em; padding: 50px;">
                            Bạn chưa đăng nhập !!
                        </h2>`;
            document.getElementsByClassName('infoUser')[0].innerHTML = warning;
        }

    }, (e) => {
        console.log(e.responseText);
    })
}

function xemChiTiet(mahd) {
    $.ajax({
        type: "GET",
        url: "php/tablechitietdonhang.php",
        data: {
            mahd: mahd
        },
        success: function(data) {
            $("#chitietdonhang").html(data);
        },
        error: function(e) {
            console.log(e.responseText);
        }
    });
}

// Phần Thông tin người dùng
function addInfoUser(user) {
    if (!user) return;
    document.getElementsByClassName('infoUser')[0].innerHTML = `
    <hr>
    <table>
        <tr>
            <th colspan="3">THÔNG TIN KHÁCH HÀNG</th>
        </tr>
        <tr>
            <td>Tài khoản: </td>
            <td> <input type="text" value="` + user.username + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'username')"></i> </td>
        </tr>
        <tr>
            <td>Mật khẩu: </td>
            <td style="text-align: center;"> 
                <i class="fa fa-pencil" id="butDoiMatKhau" onclick="openChangePass()"> Đổi mật khẩu</i> 
            </td>
            <td></td>
        </tr>
        <tr>
            <td colspan="3" id="khungDoiMatKhau">
                <table>
                    <tr>
                        <td> <div>Mật khẩu cũ:</div> </td>
                        <td> <div><input type="password"></div> </td>
                    </tr>
                    <tr>
                        <td> <div>Mật khẩu mới:</div> </td>
                        <td> <div><input type="password"></div> </td>
                    </tr>
                    <tr>
                        <td> <div>Xác nhận mật khẩu:</div> </td>
                        <td> <div><input type="password"></div> </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td> 
                            <div><button onclick="changePass()">Đồng ý</button></div> 
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>Họ: </td>
            <td> <input type="text" value="` + user.ho + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'ho')"></i> </td>
        </tr>
        <tr>
            <td>Tên: </td>
            <td> <input type="text" value="` + user.ten + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'ten')"></i> </td>
        </tr>
        <tr>
            <td>Email: </td>
            <td> <input type="text" value="` + user.email + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'email')"></i> </td>
        </tr>
        <tr>
            <td colspan="3" style="padding:5px; border-top: 2px solid #ccc;"></td>
        </tr>
        <tr>
            <td>Tổng tiền đã mua: </td>
            <td> <input type="text" value="` + numToString(tongTienTatCaDonHang) + `₫" readonly> </td>
            <td></td>
        </tr>
        <tr>
            <td>Số lượng sản phẩm đã mua: </td>
            <td> <input type="text" value="` + tongSanPhamTatCaDonHang + `" readonly> </td>
            <td></td>
        </tr>
    </table>`;
}

function openChangePass() {
    var khungChangePass = document.getElementById('khungDoiMatKhau');
    var actived = khungChangePass.classList.contains('active');
    if (actived) khungChangePass.classList.remove('active');
    else khungChangePass.classList.add('active');
}


// Phần thông tin đơn hàng
function addTatCaDonHang(user) {
    if (!user) {
        document.getElementsByClassName('listDonHang')[0].innerHTML = `
            <h3 style="width=100%; padding: 50px; color: red; font-size: 2em; text-align: center"> 
                Bạn chưa đăng nhập !!
            </h3>`;
        return;
    }
    if (!user.donhang.length) {
        document.getElementsByClassName('listDonHang')[0].innerHTML = `
            <h3 style="width=100%; padding: 50px; color: green; font-size: 2em; text-align: center"> 
                Xin chào ` + currentUser.username + `. Bạn chưa có đơn hàng nào.
            </h3>`;
        return;
    }
    for (var dh of user.donhang) {
        addDonHang(dh);
    }
}

function addDonHang(dh) {
    var div = document.getElementsByClassName('listDonHang')[0];

    var s = `
            <table class="listSanPham">
                <tr> 
                    <th colspan="6">
                        <h3 style="text-align:center;"> Đơn hàng ngày: ` + new Date(dh.ngaymua).toLocaleString() + `</h3> 
                    </th>
                </tr>
                <tr>
                    <th>STT</th>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th>Thời gian thêm vào giỏ</th> 
                </tr>`;

    var totalPrice = 0;
    for (var i = 0; i < dh.sp.length; i++) {
        var masp = dh.sp[i].ma;
        var soluongSp = dh.sp[i].soluong;
        var p = timKiemTheoMa(list_products, masp);
        var price = (p.promo.name == 'giareonline' ? p.promo.value : p.price);
        var thoigian = new Date(dh.sp[i].date).toLocaleString();
        var thanhtien = stringToNum(price) * soluongSp;

        s += `
                <tr>
                    <td>` + (i + 1) + `</td>
                    <td class="noPadding imgHide">
                        <a target="_blank" href="chitietsanpham.php?` + p.name.split(' ').join('-') + `" title="Xem chi tiết">
                            ` + p.name + `
                            <img src="` + p.img + `">
                        </a>
                    </td>
                    <td class="alignRight">` + price + ` ₫</td>
                    <td class="soluong" >
                         ` + soluongSp + `
                    </td>
                    <td class="alignRight">` + numToString(thanhtien) + ` ₫</td>
                    <td style="text-align: center" >` + thoigian + `</td>
                </tr>
            `;
        totalPrice += thanhtien;
        tongSanPhamTatCaDonHang += soluongSp;
    }
    tongTienTatCaDonHang += totalPrice;

    s += `
                <tr style="font-weight:bold; text-align:center; height: 4em;">
                    <td colspan="4">TỔNG TIỀN: </td>
                    <td class="alignRight">` + numToString(totalPrice) + ` ₫</td>
                    <td > ` + dh.tinhTrang + ` </td>
                </tr>
            </table>
            <hr>
        `;
    div.innerHTML += s;
}