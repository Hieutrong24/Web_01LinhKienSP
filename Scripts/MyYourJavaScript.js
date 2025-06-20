﻿

document.addEventListener('DOMContentLoaded', function () {

    // 1. Logic cho Slideshow (Carousel)
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    // Chỉ chạy code slideshow nếu các phần tử HTML tồn tại trên trang này
    if (slides.length > 0 && dots.length > 0) {
        function showSlide(index) {
            slideIndex = index;
            slides.forEach((slide, i) => {
                slide.classList.remove('active-slide');
                if (dots[i]) {
                    dots[i].classList.remove('active');
                }
            });
            slides[slideIndex].classList.add('active-slide');
            if (dots[slideIndex]) {
                dots[slideIndex].classList.add('active');
            }
        }

        function autoSlide() {
            slideIndex = (slideIndex + 1) % slides.length;
            showSlide(slideIndex);
        }

        // Gọi showSlide lần đầu tiên để hiển thị slide 0 ngay lập tức
        showSlide(slideIndex);
        setInterval(autoSlide, 3000);
    } else {
        console.info("Không tìm thấy các phần tử .slide hoặc .dot. Chức năng slideshow sẽ không hoạt động trên trang này.");
    }
    //Tao menu


    function addToCart(sp) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(sp);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert("Đã thêm vào giỏ hàng!");
    }
    // Logic cho hiệu ứng nút button-creative (nếu có)
    const buttonCreative = document.querySelector('.button-creative');
    if (buttonCreative) {
        buttonCreative.addEventListener('mousemove', (e) => {
            const rect = buttonCreative.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            buttonCreative.style.setProperty('--x', `${x}px`);
            buttonCreative.style.setProperty('--y', `${y}px`);
        });
    } else {
        console.info("Không tìm thấy button-creative trên trang này.");
    }




    // Hàm chung để hiển thị items vào wrapper 
    function displayItemsToWrapper(items, wrapperId) {
        const wrapper = document.getElementById(wrapperId);
        if (wrapper && items) { // Kiểm tra cả wrapper và items
            wrapper.innerHTML = "";
            items.forEach(item => wrapper.appendChild(item));
        } else {
            console.warn(`Không tìm thấy wrapper với ID "${wrapperId}" hoặc items rỗng.`);
        }
    }


    // ===== 1. Tạo danh sách sản phẩm (dạng card) phân trang (sử dụng sanPhamData) =====
    // Đây là phần code có thể chạy trên trang Index/TrangChu
    // Chỉ chạy nếu sanPhamData được định nghĩa và có dữ liệu
    if (typeof sanPhamData !== 'undefined' && sanPhamData && sanPhamData.length > 0) {
        const itemsPerPage = 8;
        let currentPage = 1;

        const dataContainer = document.getElementById("data-container");
        const paginationContainer = document.getElementById("pagination");

        if (dataContainer && paginationContainer) { // Chỉ chạy nếu có container cho phần này
            // Tạo các items từ sanPhamData
            const items = sanPhamData.slice(0, 16).map((sp) => {
                const col = document.createElement('div');
                col.className = 'col-3 mb-4';

                const card = document.createElement('div');
                card.className = 'card h-100 d-flex flex-column';

                const img = document.createElement('img');
                img.src = sp.Img;
                img.className = 'card-img-top';
                img.alt = sp.TenSP || 'Product image'; // Thêm sp.TenSP vào alt

                const body = document.createElement('div');
                body.className = 'card-body d-flex flex-column';

                const title = document.createElement('h6');
                title.className = 'card-title';
                title.innerText = sp.TenSP;

                const price = document.createElement('p');
                price.className = 'card-text text-danger mb-1';
                price.innerText = sp.GiaHT;

                const original = document.createElement('p');
                original.className = 'card-text text-muted';
                original.innerHTML = `<s>${sp.GiaGoc}</s>`;

                const chillDiv = document.createElement('div');
                chillDiv.className = 'd-flex gap-2 mt-auto';

                const icon = document.createElement('i');
                icon.className = 'fas fa-shopping-cart align-self-center text-danger';

                const button = document.createElement('button');
                button.className = 'btn btn-danger flex-grow-1';
                button.addEventListener('click', function () {
                    addToCart(sp);
                })
                button.innerText = ' Thêm vào giỏ';

                chillDiv.appendChild(icon);
                chillDiv.appendChild(button);

                body.appendChild(title);
                body.appendChild(price);
                body.appendChild(original);
                body.appendChild(chillDiv);

                card.appendChild(img);
                card.appendChild(body);
                col.appendChild(card);

                return col;
            });

            // Hàm displayItems riêng cho phân trang (cần wrapper, rowsPerPage, page)
            function displayPaginatedItems(items, wrapper, rowsPerPage, page) {
                wrapper.innerHTML = "";
                const start = (page - 1) * rowsPerPage;
                const end = start + rowsPerPage;
                const paginatedItems = items.slice(start, end);
                paginatedItems.forEach(item => wrapper.appendChild(item));
            }
            let s1 = "Sản phẩm nổi bật", s2 = "Sản phẩm khuến mãi";
            function setupPagination(items, wrapper, rowsPerPage) {
                wrapper.innerHTML = "";
                const pageCount = Math.ceil(items.length / rowsPerPage);
                const ul = document.createElement("ul");
                ul.className = "pagination justify-content-center";

                // Sửa lại: Nút phân trang nên hiển thị số trang
                for (let i = 1; i <= pageCount; i++) {
                    const li = document.createElement("li");
                    li.className = "page-item" + (i === currentPage ? " active" : "");

                    const btn = document.createElement("button");
                    btn.className = "page-link";
                    if (i == 1) {
                        btn.innerText = s1;
                    }
                    else {
                        btn.innerText = s2;
                    }

                    btn.addEventListener("click", () => {
                        currentPage = i;
                        displayPaginatedItems(items, dataContainer, rowsPerPage, currentPage);
                        setupPagination(items, wrapper, rowsPerPage); // Gọi lại để cập nhật trạng thái active
                    });

                    li.appendChild(btn);
                    ul.appendChild(li);
                }
                wrapper.appendChild(ul);
            }

            displayPaginatedItems(items, dataContainer, itemsPerPage, currentPage);
            setupPagination(items, paginationContainer, itemsPerPage);
        } else {
            console.info("Trang này không có phần Sản phẩm (dạng card) phân trang.");
        }
    } else {
        console.info("Biến sanPhamData không được định nghĩa hoặc rỗng trên trang này.");
    }


    // ===== 2. Tạo danh sách 7 sản phẩm nổi bật (sử dụng sanPhamData) =====
    // Chỉ chạy nếu sanPhamData được định nghĩa và có dữ liệu
    if (typeof sanPhamData !== 'undefined' && sanPhamData && sanPhamData.length > 0) {
        const items1 = sanPhamData.slice(0, 10).map((sp) => {
            const container = document.createElement('div');
            container.className = "row align-items-center mb-3";

            const imgCol = document.createElement('div');
            imgCol.className = "col-4";
            const img = document.createElement('img');
            img.src = sp.Img;
            img.className = "img-fluid";
            img.alt = sp.TenSP || 'Product image';
            imgCol.appendChild(img);

            const infoCol = document.createElement('div');
            infoCol.className = "col-8";

            const title = document.createElement('h6');
            title.className = 'mb-1';
            title.innerText = sp.TenSP;

            const price = document.createElement('p');
            price.className = 'text-danger mb-1';
            price.innerText = sp.GiaHT;

            const original = document.createElement('p');
            original.className = 'text-muted mb-0';
            original.innerHTML = `<s>${sp.GiaGoc}</s>`;

            infoCol.appendChild(title);
            infoCol.appendChild(price);
            infoCol.appendChild(original);

            container.appendChild(imgCol);
            container.appendChild(infoCol);

            return container;
        });

        displayItemsToWrapper(items1, "bestseller"); // Sử dụng hàm chung
    } else {
        console.info("Biến sanPhamData không được định nghĩa hoặc rỗng cho phần sản phẩm nổi bật.");
    }


    // ===== 3. Hiển thị danh sách 12 sản phẩm khác (KHÔNG có nút thêm vào giỏ) (sử dụng sanPhamData) =====
    // Chỉ chạy nếu sanPhamData được định nghĩa và có dữ liệu
    if (typeof sanPhamData !== 'undefined' && sanPhamData && sanPhamData.length > 0) {
        const items2 = sanPhamData.slice(0, 12).map((sp) => {
            const col = document.createElement('div');
            col.className = "col-2 mb-4";

            const card = document.createElement('div');
            card.className = 'card h-100 d-flex flex-column';

            const img = document.createElement('img');
            img.src = sp.Img;
            img.className = 'card-img-top';
            img.alt = sp.TenSP || 'Product image';

            const body = document.createElement('div');
            body.className = 'card-body d-flex flex-column';

            const title = document.createElement('h6');
            title.className = 'card-title';
            title.innerText = sp.TenSP;

            const price = document.createElement('p');
            price.className = 'card-text text-danger mb-1';
            price.innerText = sp.GiaHT;

            const original = document.createElement('p');
            original.className = 'card-text text-muted';
            original.innerHTML = `<s>${sp.GiaGoc}</s>`;

            body.appendChild(title);
            body.appendChild(price);
            body.appendChild(original);

            card.appendChild(img);
            card.appendChild(body);
            col.appendChild(card);

            return col;
        });

        displayItemsToWrapper(items2, "data-container1"); // Sử dụng hàm chung
    } else {
        console.info("Biến sanPhamData không được định nghĩa hoặc rỗng cho phần 12 sản phẩm khác.");
    }


    // ===== 4. Intel_core (sử dụng sanPham_Intel_Data) =====
    // Chỉ chạy nếu sanPham_Intel_Data được định nghĩa và có dữ liệu
    if (typeof sanPham_Intel_Data !== 'undefined' && sanPham_Intel_Data && sanPham_Intel_Data.length > 0) {
        const items3 = sanPham_Intel_Data.map((sp) => {
            const col = document.createElement('div');
            col.className = ' text-center col-md-3 mb-4';

            const card = document.createElement('div');
            card.className = 'card h-100 d-flex flex-column';

            const img = document.createElement('img');
            img.alt = sp.TenSP || 'Product image';
            img.src = sp.Img;
            img.className = 'card-img-top';

            const body = document.createElement('div');
            body.className = 'card-body d-flex flex-column';

            const title = document.createElement('h6');
            title.className = 'card-title';
            title.innerText = sp.TenSP;

            const price = document.createElement('p');
            price.className = 'card-text text-danger mb-1';
            price.innerText = sp.GiaHT;

            const original = document.createElement('p');
            original.className = 'card-text text-muted';
            original.innerHTML = `<s>${sp.GiaGoc}</s>`;

            const chillDiv = document.createElement('div');
            chillDiv.className = 'd-flex gap-2 mt-auto';

            const icon = document.createElement('i');
            icon.className = 'fas fa-shopping-cart align-self-center text-danger';

            const button = document.createElement('button');
            button.className = 'btn btn-danger flex-grow-1';
            button.type = 'submit';
            button.innerText = ' Thêm vào giỏ';
            button.addEventListener('click', function () {
                addToCart(sp);
                sendToCardSever(sp);
            });
            button.setAttribute('data-masp', sp.ID);

            chillDiv.appendChild(icon);
            chillDiv.appendChild(button);

            body.appendChild(title);
            body.appendChild(price);
            body.appendChild(original);
            body.appendChild(chillDiv);

            card.appendChild(img);
            card.appendChild(body);
            col.appendChild(card);

            return col;
        });

        displayItemsToWrapper(items3, "Intel"); // Sử dụng hàm chung
        displayItemsToWrapper(items3, "ryzen");

    } else {
        console.info("Biến sanPham_Intel_Data không được định nghĩa hoặc rỗng trên trang Intel_core.");
    }

    //==========giohang
    if (typeof sanPham_GioHang !== 'undefined' && sanPham_GioHang && sanPham_GioHang.length > 0) {
        const container = document.getElementById('container');

        sanPham_GioHang.forEach((sp) => {
            const card = document.createElement('div');
            card.className = 'card mb-3 bg-light';
            card.style.maxWidth = '100%';

            const row = document.createElement('div');
            row.className = 'row g-0';

            
            const colImg = document.createElement('div');
            colImg.className = 'col-md-3 d-flex align-items-center justify-content-center';
            const img = document.createElement('img');
            img.src = sp.IMG;
            img.className = 'img-fluid rounded-start';
            img.style.maxHeight = '100px';
            colImg.appendChild(img);

           
            const colBody = document.createElement('div');
            colBody.className = 'col-md-6';

            const body = document.createElement('div');
            body.className = 'card-body';

            const title = document.createElement('h5');
            title.className = 'card-title';
            title.innerText = sp.TENSP;

            const giaHT = document.createElement('p');
            giaHT.className = 'cart-text mb-1';
            giaHT.innerHTML = `<strong>Giá hiện tại:</strong> ${sp.GIAHT.toLocaleString()} ₫`;

            const giaGoc = document.createElement('p');
            giaGoc.className = 'card-text';
            giaGoc.innerHTML = `<small class="text-muted"><s>Giá gốc: ${sp.GIAGOC.toLocaleString()} ₫</s></small>`;

            const qtyControls = document.createElement('div');
            qtyControls.className = 'd-flex align-items-center mt-2';

            const btnMinus = document.createElement('button');
            btnMinus.className = 'btn btn-outline-secondary btn-sm';
            btnMinus.innerText = '-';
            btnMinus.onclick = function () {
                const input = document.getElementById(`qty_${sp.ID}`);
                let current = parseInt(input.value);
                if (current > 0) {
                    input.value = current - 1;
                }
            };

            const inputQty = document.createElement('input');
            inputQty.type = 'text';
            inputQty.className = 'form-control text-center mx-2';
            inputQty.style.width = '60px';
            inputQty.id = `qty_${sp.ID}`;
            inputQty.value = sp.SOLUONG;
            inputQty.readOnly = true;

            const btnPlus = document.createElement('button');
            btnPlus.className = 'btn btn-outline-secondary btn-sm';
            btnPlus.innerText = '+';
            btnPlus.onclick = function () {
                const input = document.getElementById(`qty_${sp.ID}`);
                let current = parseInt(input.value);
                input.value = current + 1;
            };

            qtyControls.appendChild(btnMinus);
            qtyControls.appendChild(inputQty);
            qtyControls.appendChild(btnPlus);

            body.appendChild(title);
            body.appendChild(giaHT);
            body.appendChild(giaGoc);
            body.appendChild(qtyControls);
            colBody.appendChild(body);

           
            const divCheck = document.createElement('div');
            divCheck.className = 'col-md-3 d-flex align-items-center justify-content-center';

            const inputCheck = document.createElement('input');
            inputCheck.type = 'checkbox';
            inputCheck.className = 'form-check-input chon-sanpham';
            inputCheck.style.width = '20px';
            inputCheck.style.height = '20px';
            inputCheck.style.border = '2px solid blue';
            inputCheck.dataset.idgiohang = sp.ID;
            inputCheck.dataset.giaht = sp.GIAHT;
            inputCheck.dataset.soluong = sp.SOLUONG;
 

            divCheck.appendChild(inputCheck);

            
            row.appendChild(colImg);
            row.appendChild(colBody);
            row.appendChild(divCheck);

            card.appendChild(row);
            container.appendChild(card);
        });
    }

    function xuLyDatHang() {
        const checkboxes = document.querySelectorAll('.chon-sanpham');
        const tongTienElement = document.getElementById('tongTien');
        const btnDatHang = document.getElementById('btnDatHang');

        if (!checkboxes.length || !tongTienElement || !btnDatHang) {
            console.error("Không tìm thấy phần tử cần thiết để xử lý đặt hàng.");
            return;
        }

        function tinhTongTien() {
            let tong = 0;
            checkboxes.forEach(cb => {
                if (cb.checked) {
                    const gia = parseFloat(cb.dataset.giaht);
                    const soLuong = parseInt(cb.dataset.soluong);
                    tong += gia * soLuong;
                }
            });
            tongTienElement.textContent = `Tổng tiền: ${tong.toLocaleString()} VNĐ`;
            return tong;
        }

        checkboxes.forEach(cb => {
            cb.addEventListener('change', tinhTongTien);
        });

        btnDatHang.addEventListener('click', function (e) {
            const selected = [];
            checkboxes.forEach(cb => {
                if (cb.checked) {
                    selected.push({
                        Id_TTGioHang: cb.dataset.idgiohang,
                        SoLuong: cb.dataset.soluong,
                        NgayMua: new Date().toISOString(),
                        DiaChiNhanHang: document.getElementById('selectXa')?.value || 'Không rõ'
                    });
                }
            });

            if (selected.length === 0) {
                alert("Bạn chưa chọn sản phẩm nào!");
                return;
            }

            // Gửi dữ liệu về Controller
            fetch('/Home/LishSuMuaHnag', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selected)
            })
                .then(res => {
                    if (res.ok) {
                        alert("Đặt hàng thành công!");
                        window.location.reload();
                    } else {
                        alert("Lỗi khi đặt hàng!");
                    }
                })
                .catch(err => {
                    console.error("Lỗi mạng:", err);
                });
        });
    }
    xuLyDatHang();




    function showCustomMessage(message, isSuccess = true) {
        const messageBox = document.getElementById('custom-message-box');
        if (!messageBox) {
            console.error('Element with ID "custom-message-box" not found. Cannot display message.');
            
            if (isSuccess) {
                console.log(message);
            } else {
                console.error(message);
            }
            return;
        }

        messageBox.innerText = message;
        messageBox.style.display = 'block';
        messageBox.className = isSuccess ? 'alert alert-success' : 'alert alert-danger';

       
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000);
    }


    function sendToCardSever(sp) {

        fetch('/Home/ThongTinGioHang', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

                TENSP: sp.TenSP,
                IMG: sp.Img,
                GIAGOC: sp.GiaGoc,
                GIAHT: sp.GiaHT,
                SOLUONG: 1,

            })
        })
            .then(response => {
                if (response.ok) {
                    showCustomMessage("Đã thêm sản phẩm vào giỏ hàng thành công!", true);
                } else if (response.status === 401) {
                    showCustomMessage("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.", false);

                    setTimeout(() => { window.location.href = '/Home/DangNhap'; }, 2000);
                } else {
                    showCustomMessage("Lỗi khi thêm sản phẩm vào giỏ hàng.", false);
                }
                return response.text(); 
            })
            .then(data => {
                console.log('Server Response:', data); // In phản hồi từ server
            })
            .catch(error => {
                console.error("Lỗi mạng hoặc lỗi khác:", error);
                showCustomMessage("Có lỗi xảy ra: " + error.message, false);
            });
    }

    function loadTinhVaXa() {
        let tinhXaData = [];

        fetch('/Home/GetTinhVaXa')
            .then(response => response.json())
            .then(data => {
                tinhXaData = data;

                const selectTinh = document.getElementById('selectTinh');
                const selectXa = document.getElementById('selectXa');

                // Đổ dữ liệu tỉnh vào selectTinh
                data.forEach(tinh => {
                    const option = document.createElement('option');
                    option.value = tinh.Id;
                    option.textContent = tinh.TenTinh;
                    selectTinh.appendChild(option);
                });

                // Khi tỉnh thay đổi => load xã/phường
                selectTinh.addEventListener('change', function () {
                    const selectedId = parseInt(this.value);
                    const selectedTinh = tinhXaData.find(t => t.Id === selectedId);

                    // Xóa xã cũ
                    selectXa.innerHTML = '<option value="">-- Chọn xã --</option>';

                    if (selectedTinh && selectedTinh.XaPhuongs.length > 0) {
                        selectedTinh.XaPhuongs.forEach(xa => {
                            const option = document.createElement('option');
                            option.value = xa.Id;
                            option.textContent = xa.TenXaPhuong;
                            selectXa.appendChild(option);
                        });
                    }
                });
            })
            .catch(error => console.error('Lỗi khi lấy tỉnh/xã:', error));

    }
    loadTinhVaXa();

}); 
