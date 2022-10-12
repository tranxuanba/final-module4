document.addEventListener('DOMContentLoaded', () => {
    fetchCities()
})
function fetchCountries() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8095/citys/countries`,
        success: (data) => {
            const countries = data.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
            $('#country').html(countries);
        }
    })
}

function fetchCities() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8095/citys`,
        success: (data) => {
            const cities = data.map(c => displayCity(c)).join();
            const htmls = `
                  <div class="container">
                  <div class="row">
                        <div class="col-lg-9">
                            <h1>Danh sách thành phố</h1>
                        </div>
                        <div class="col-lg-3" style="padding-left: 60px">
                            <button onclick="modalFormCreate()" type="button" class="btn btn-primary">Thêm thành phố</button>
                        </div>
                  </div>
                       <div class="row">
                            <div class="col-lg-12">
                                <div class="main-box clearfix">
                                    <div class="table-responsive">
                                        <table class="table user-list">
                                            <thead>
                                                <tr>
                                                <th>#</th>
                                                <th><span>Thành phố</span></th>
                                                <th><span>Quốc gia</span></th>
                                                <th>&nbsp;</th>
                                                </tr>
                                            </thead>
                                            <tbody id="cities">
                                                ${cities}
                                            </tbody>
                                        </table>
                                    </div>
                              </div>
                          </div>
                      </div>
                  </div>`
            $('.root').html(htmls)
        }
    })
    event.preventDefault()
}

const displayCity = (city) =>{
    return `
           <tr>
               <td>${city.id}</td>
               <td>${city.name}</td>
               <td>${city.country.name}</td>
               <td style="width: 20%;">
                   <a onclick="handleViewBtn(${city.id})" class="table-link">
                       <span class="fa-stack">
                       <i class="fa fa-square fa-stack-2x"></i>
                       <i class="fa fa-search-plus fa-stack-1x fa-inverse"></i>
                       </span>
                   </a>
                   <a onclick="loadUpdate(${city.id})" class="table-link">
                       <span class="fa-stack">
                       <i class="fa fa-square fa-stack-2x"></i>
                       <i class="fa fa-pencil fa-stack-1x fa-inverse"></i>
                       </span>
                   </a>
                   <a onclick="handleRemoveBtn(${city.id})" class="table-link danger">
                       <span class="fa-stack">
                       <i class="fa fa-square fa-stack-2x"></i>
                       <i class="fa fa-trash-o fa-stack-1x fa-inverse"></i>
                       </span>
                   </a>
               </td>
           </tr>`
}

function handleViewBtn(id) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8095/citys/${id}`,
        success: (data) => {
            const htmls = `
                       <div class="modal fade" id="myModal" role="dialog">
                         <div class="modal-dialog" role="dialog">
                           <div class="modal-content">
                             <div class="modal-header">
                               <h2 class="modal-title">Thành phố ${data.name}</h2>
                               <button type="button" onclick="handleClose()" class="close" data-dismiss="modal" aria-label="Close">
                                 <span aria-hidden="true"">&times;</span>
                               </button>
                             </div>
                             <div class="modal-body">
                               <h6>Tên: </h6><span>${data.name}</span>
                               <h6>Quốc gia: </h6><span>${data.country.name}</span>
                               <h6>Diện tích: </h6><span>${data.population}</span>
                               <h6>GDP: </h6><span>${data.gdp}</span>
                               <h6>Giới thiệu: </h6>
                               <p>${data.description}</p>
                             </div>
                             <div class="modal-footer">
                               <button type="button" onclick="handleClose()" id="close" class="btn btn-secondary">Thoát</button>
                               <button type="button" onclick="handleRemoveBtn(${id})" class="btn btn-primary">Xoá</button>
                             </div>
                           </div>
                         </div>
                       </div>`
            $('.show').html(htmls)
            $('#myModal').modal('show');
        }
    })
    event.preventDefault()
}

function handleRemoveBtn(id) {
    if(confirm("Bạn chắc chắn muốn xoá thành phố")) {
        $.ajax({
            type: "DELETE",
            url: `http://localhost:8095/citys/${id}`,
            success: () => {
                fetchCities()
            }
        })
        event.preventDefault();
    }
}

function handleCreateBtn() {
    let name = $('#name').val()
    let area = $('#area').val()
    let population = $('#population').val()
    let gdp = $('#gdp').val()
    let description = $('#description').val()
    let country = $('#country').val()
    if(name !== "" && area > 0 && population > 0 && gdp > 0 ) {
        const city = {
            name: name,
            area: area,
            population: population,
            gdp : gdp,
            description : description,
            country: {
                id: country
            }
        }
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            type: "POST",
            url: `http://localhost:8095/citys`,
            data: JSON.stringify(city),
            success: (data) => {
                alert("Tạo mới thành phố thành công")
                fetchCities()
            }
        })
        event.preventDefault()
    } else {
        $('#error_login').html("Nhập trường dữ liệu không đúng")
        return false
    }
}

function modalFormCreate() {
    const htmls = `
                   <div class="modal fade" id="myModal" role="dialog">
                       <div class="modal-dialog" role="dialog">
                         <div class="modal-content">
                           <div class="modal-header">
                             <h2 class="modal-title">Thêm mới thành phố</h2>
                             <button type="button" onclick="handleClose()" class="close" data-dismiss="modal" aria-label="Close">
                               <span aria-hidden="true"">&times;</span>
                             </button>
                           </div>
                           <div class="modal-body">
                                <span id="error_login" style="color: red"></span>
                                <br>
                                <label class="form-text">Tên thành phố </label>
                                <input type="text" class="form__input" placeholder="Nhập tên thành phố" id="name" required>
                                <label class="form-text">Quốc gia </label>
                                <select name="" id="country">
                                    
                                </select>
                                <br>
                                <label class="form-text">Diện tích :</label>
                                <input type="text" class="form__input" placeholder="Nhập diện tích" id="area" required>
                                <label class="form-text">Dân số :</label>
                                <input type="text" class="form__input" placeholder="Nhập dân số" id="population" required>
                                <label class="form-text">GDP :</label>
                                <input type="text" class="form__input" placeholder="Nhập GDP" id="gdp" required>
                                <label class="form-text">Giới thiệu :</label>
                                <textarea class="form__input" placeholder="Nhập giới thiệu" id="description"></textarea>
                           </div>
                           <div class="modal-footer">
                             <button onclick="handleCreateBtn()" type="button" class="btn btn-primary">Tạo mới</button>
                             <button type="button" onclick="handleClose()" id="close" class="btn btn-secondary">Thoát</button>
                           </div>
                         </div>
                       </div>
                   </div>`
    fetchCountries()
    $('.show').html(htmls)
    $('#myModal').modal('show');
}

function loadUpdate(id) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8095/citys/${id}`,
        success: (data) => {
            modalFormUpdate(id)
            $('#name').val(data.name)
            $('#area').val(data.area)
            $('#population').val(data.population)
            $('#gdp').val(data.gdp)
            $('#description').val(data.description)
            $('#country').val(data.country.id)
        }
    })
}


function modalFormUpdate(id) {
    const htmls = `
                   <div class="modal fade" id="myModal" role="dialog">
                       <div class="modal-dialog" role="dialog">
                         <div class="modal-content">
                           <div class="modal-header">
                             <h2 class="modal-title">Cập nhật thành phố</h2>
                             <button type="button" onclick="handleClose()" class="close" data-dismiss="modal" aria-label="Close">
                               <span aria-hidden="true"">&times;</span>
                             </button>
                           </div>
                           <div class="modal-body">
                                <span id="error_login" style="color:red"></span>
                                <br>
                                <label class="form-text">Tên thành phố </label>
                                <input type="text" class="form__input" placeholder="Nhập tên thành phố" id="name" required>
                                <label class="form-text">Quốc gia </label>
                                <select name="" id="country">
                                    
                                </select>
                                <br>
                                <label class="form-text">Diện tích :</label>
                                <input type="text" class="form__input" placeholder="Nhập diện tích" id="area" required>
                                <label class="form-text">Dân số :</label>
                                <input type="text" class="form__input" placeholder="Nhập dân số" id="population" required>
                                <label class="form-text">GDP :</label>
                                <input type="text" class="form__input" placeholder="Nhập GDP" id="gdp" required>
                                <label class="form-text">Giới thiệu :</label>
                                <textarea class="form__input" placeholder="Nhập giới thiệu" id="description"></textarea>
                           </div>
                           <div class="modal-footer">
                             <button onclick="handleUpdateBtn(${id})" type="button" class="btn btn-primary">Cập nhật</button>
                             <button type="button" onclick="handleClose()" id="close" class="btn btn-secondary">Thoát</button>
                           </div>
                         </div>
                       </div>
                   </div>`
    fetchCountries()
    $('.show').html(htmls)
    $('#myModal').modal('show');
}

function handleUpdateBtn(id) {
    let name = $('#name').val()
    let area = $('#area').val()
    let population = $('#population').val()
    let gdp = $('#gdp').val()
    let description = $('#description').val()
    let country = $('#country').val()
    if(name !== "" && area > 0 && population > 0 && gdp > 0 ) {
        const city = {
            name: name,
            area: area,
            population: population,
            gdp : gdp,
            description : description,
            country: {
                id: country
            }
        }
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            type: 'PUT',
            url: `http://localhost:8095/citys/${id}`,
            data: JSON.stringify(city),
            success: (data) => {
                $('#myModal').modal('hide');
                alert("Cập nhật thành phố thành công")
                fetchCities()
            }
        })
        event.preventDefault()
    } else {
        $('#error_login').html("Nhập trường dữ liệu không đúng")
        return false
    }
}

function handleClose() {
    $('#myModal').modal('hide');
    event.preventDefault()
}