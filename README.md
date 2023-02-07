
# Tonasa Backend API

## Get Started
- Clone repository with command `git clone <alamat_repo>`
- Move to directory backend-express `backend-express`
- Install dependencies using command `npm install`
- Create an .env file. filename is .env. 
  Make sure that .env has content like this:

  ```
  # node-postgres configuration (prod)
  PGHOST=
  PGDATABASE=
  PGPORT=
  PGUSER=
  PGPASSWORD=
  PORT=
 
  ```

- migrate to the db `npm run migrate up`
- Running the server `npm run dev`

### Generate JWT Token
- Access & Refresh Token
  - In terminal/cmd type node then enter
  - Type this code to generate token
  - Copy the output and paste to the .env->SECRET

## API

### Authentication User
- Login
    - method: `POST`
    - endpoint :`/login`
    - body request:
    ```json
    {
        "username": string | required, 
        "password": string | required
    }
    ```
    - body response:
    ```json
    {
      "status": "success",
      "message": "Login Success",
      "userData": {
          "id": 2,
          "username": "brillianita",
          "role": "kontraktor"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoyLCJpYXQiOjE2NzUyNTE3ODAsImV4cCI6MTY3NTI1MTkwMH0.mYRrKKq708XRu-O0lxGive0efAoyanut9Dn2mXkdi0Q",
      "refreshToken": "3f3018ab-df98-4828-b83e-562a8f794e3a"
    }
    ```
 
- Update Access Token
  - method: `PUT`,
  - endpoint: `/refreshToken`
  - body request:
    ```json
    {
        "refreshToken": token|required
    }
    ```
  - body response:
  ```json
  {
      "status": "success",
      "message": "Token updated!",
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "dd1921e..."
  }
  ```
 
 - Logout
    - method: `DELETE`
    - endpoint :`/logout`
    - body request:
    ```json
    {
        "refreshToken": token | required
    }
    ```
    - body response:
    ```json
    {
      "status": "success",
      "message": "Authentications has been removed"
    }
    ```

### Accessing Kontraktor
- Get Recap
    - method: `GET`
    - endpoint: `/kontraktor`
    - authorization: 
      - type: `Bearer Token`,
      - token: `accessToken`
    - body response:
    ```json
    {
        "status": "success",
        "data": [{
            "id": 6,
            "jenis_pekerjaan": "electrical",
            "nama_pekerjaan": "tetsts",
            "nomor_kontrak": "9845985",
            "kont_pelaksana": "hhjdd",
            "lokasi_pekerjaan": "makassar"
        },...
        ]
    }
    ```
  ---- **_Pagination_** ----     
     - endpoint: `/kontraktor?pageSize=10&currentPage=1`  
      will show 10 first kontraktors.  
      `pageSize` stand for how many kontraktor that can be shown in one page.  
      `currentPage` stand for kontraktor current page. 
     - body response:
     ```json
      {
          "status": "success",
          "data": [
              {
                "id": 6,
                "jenis_pekerjaan": "electrical",
                "nama_pekerjaan": "tetsts",
                "nomor_kontrak": "9845985",
                "kont_pelaksana": "hhjdd",
                "lokasi_pekerjaan": "makassar"
              },...
          ],
              "page": {
              "page_size": "2",
              "total_rows": "19",
              "total_pages": 10,
              "currentPage": "1"
          }
      }
    ```  
  ---- **_Search_** ----    
  - endpoint: `/kontraktor?search=brillianita`  
  will filter the kontraktors and only show the kontraktor within `search` Brillianita 

- Get kontraktor By Id kontraktor
  - method: `GET`
  - endpoint: `/kontraktor/:id`,
  - authorization: 
    - type: `Bearer Token`,
    - token: `accessToken`
  - body response: 
  ```json
  {
      "status": "success",
      "data`": [
          {
            "id": 6,
            "jenis_pekerjaan": "electrical",
            "nama_pekerjaan": "tetsts",
            "nomor_kontrak": "9845985",
            "kont_pelaksana": "hhjdd",
            "lokasi_pekerjaan": "makassar"
          }
      ]
  }
  ```
- Insert New Kontraktor
  - method: `POST`
  - endpoint: `/kontraktor/tambah`,
  - Authorization:
    - type: `Bearer Token`,
    - token: `accessToken`
  - body request:
  ```json
    {
        "jenisPekerjaan": string | required,
        "namaPekerjaan": string | required,
        "nomorKontrak": string | required,
        "lokasiPekerjaan": string | required,
        "kontPelaksana": string | required, 
        "username": string | required,
        "password": string | required,
        "confirmPassword": string | required
    }
  ```
  - body response: 
  ```json
  {
    "status": "success",
    "message": "Register Successfull!"
  }
  ````  
- Update Kontraktor Paswword
  - method: `PUT`
  - endpoint: `/kontraktor/:id`,
  - Authorization:
    - type: `Bearer Token`,
    - token: `accessToken`
  - body request:
  ```json
    { 
      "jenisPekerjaan": string | required,
      "kontPelaksana": string | required,
      "namaPekerjaan": string | required,
      "lokasiPekerjaan": string | required,
      "username": string | required,
      "oldPass": string,
      "newPass": string,
      "confirmNewPass": string
    }
  ```
  - body response: 
  ```json
  {
    "status": "success",
    "message": "kontraktor data has been updated"
  }
  ````  
- Delete Kontraktor By Id
  - method: `DELETE`
  - endpoint: `/kontraktor/:id`,
  - Authorization:
    - type: `Bearer Token`,
    - token: `accessToken`
  - body response: 
  ```json
  {
    "status": "success",
    "message": "User has been removed",
  }
  ````  
### Accessing Staff
- Get Recap
    - method: `GET`
    - endpoint: `/staff`
    - authorization: 
      - type: `Bearer Token`,
      - token: `accessToken`
    - body response:
    ```json
    {
        "status": "success",
        "data": [{
            "id": 2,
            "nama": "ditaa",
            "sap": "873538959",
            "seksi": "pengadaan"
        },...
        ]
    }
    ```
  ---- **_Pagination_** ----     
     - endpoint: `/staff?pageSize=10&currentPage=1`  
      will show 10 first staff.  
      `pageSize` stand for how many staff that can be shown in one page.  
      `currentPage` stand for staff current page. 
     - body response:
     ```json
      {
          "status": "success",
          "data": [
              {
                "id": 2,
            "nama": "ditaa",
            "sap": "873538959",
            "seksi": "pengadaan"
              },...
          ],
              "page": {
              "page_size": "2",
              "total_rows": "19",
              "total_pages": 10,
              "currentPage": "1"
          }
      }
    ```
  ---- **_Search_** ----    
  - endpoint: `/staff?search=brillianita`  
  will filter the staff and only show the staff within `search` Brillianita 

- Get Staff By Id staff
  - method: `GET`
  - endpoint: `/staff/:id`,
  - authorization: 
    - type: `Bearer Token`,
    - token: `accessToken`
  - body response: 
  ```json
    {
        "status": "success",
        "data": [
            {
                "id": 2,
                "nama": "ditaa",
                "sap": "873538959",
                "seksi": "pengadaan"
            }
        ]
    }
  ```
- Insert New staff
  - method: `POST`
  - endpoint: `/staff/tambah`,
  - Authorization:
    - type: `Bearer Token`,
    - token: `accessToken`
  - body request:
  ```json
    {
        "nama": string | required,
        "sap": string | required,
        "seksi": string | required,
        "username": string | required,
        "password": string | required,
        "confirmPassword": string | required
    }
  ```
  - body response: 
  ```json
  {
    "status": "success",
    "message": "Register Successfull!"
  }
  ````  
- Update Staff Paswword
  - method: `PUT`
  - endpoint: `/staff/:id`,
  - Authorization:
    - type: `Bearer Token`,
    - token: `accessToken`
  - body request:
  ```json
    { 
      "nama": string | required,
      "sap": string | required,
      "seksi": string | required,
      "username": string | required,
      "oldPass": string,
      "newPass": string,
      "confirmNewPass": string
    }
  ```
  - body response: 
  ```json
  {
    "status": "success",
    "message": "staff has been updated"
  }
  ````
- Delete Staff By Id
  - method: `DELETE`
  - endpoint: `/staff/:id`,
  - Authorization:
    - type: `Bearer Token`,
    - token: `accessToken`
  - body response: 
  ```json
  {
    "status": "success",
    "message": "User has been removed",
  }
  ````    
### Accessing Admin
- Get Recap
    - method: `GET`
    - endpoint: `/admin`
    - authorization: 
      - type: `Bearer Token`,
      - token: `accessToken`
    - body response:
    ```json
    {
        "status": "success",
        "data": [{
            "id": 2,
            "nama": "ditaa",
            "sap": "873538959",
            "seksi": "pengadaan"
        },...
        ]
    }
    ```
  ---- **_Pagination_** ----     
     - endpoint: `/admin?pageSize=10&currentPage=1`  
      will show 10 first admin.  
      `pageSize` stand for how many admin that can be shown in one page.  
      `currentPage` stand for admin current page. 
     - body response:
     ```json
      {
          "status": "success",
          "data": [
              {
                "id": 2,
            "nama": "ditaa",
            "sap": "873538959",
            "seksi": "pengadaan"
              },...
          ],
              "page": {
              "page_size": "2",
              "total_rows": "19",
              "total_pages": 10,
              "currentPage": "1"
          }
      }
    ```
  ---- **_Search_** ----    
  - endpoint: `/admin?search=brillianita`  
  will filter the admin and only show the admin within `search` Brillianita 

- Get Admin By Id admin
  - method: `GET`
  - endpoint: `/admin/:id`,
  - authorization: 
    - type: `Bearer Token`,
    - token: `accessToken`
  - body response: 
  ```json
    {
        "status": "success",
        "data": [
            {
                "id": 2,
                "nama": "ditaa",
                "sap": "873538959",
                "seksi": "pengadaan"
            }
        ]
    }
  ```
- Insert New admin
  - method: `POST`
  - endpoint: `/admin/tambah`,
  - Authorization:
    - type: `Bearer Token`,
    - token: `accessToken`
  - body request:
  ```json
    {
        "nama": string | required,
        "sap": string | required,
        "seksi": string | required,
        "username": string | required,
        "password": string | required,
        "confirmPassword": string | required
    }
  ```
  - body response: 
  ```json
  {
    "status": "success",
    "message": "Register Successfull!"
  }
  ````  
- Update Admin Paswword
  - method: `PUT`
  - endpoint: `/admin/:id`,
  - Authorization:
    - type: `Bearer Token`,
    - token: `accessToken`
  - body request:
  ```json
    { 
      "nama": string | required,
      "sap": string | required,
      "seksi": string | required,
      "username": string | required,
      "oldPass": string,
      "newPass": string,
      "confirmNewPass": string
    }
  ```
  - body response: 
  ```json
  {
    "status": "success",
    "message": "admin data has been updated"
  }
  ````

### Accessing Laporan (For Kontraktor)
- Get proyek by nomorKontrak
  - method: `GET`
  - endpoint: `/proyek/:nomorKontrak`
  - authorization: 
    - type: `Bearer Token`,
    - token: `accessToken`
  - body response:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 2,
        "nama_vendor": "hdhdh",
        "id_datum": 69,
        "no_proyek": "8400001417",
        "nm_proyek": "Pekerjaan Tambahan Perintisan Jalan Tanah Liat Paccola",
        "no_kontrak": "0987654321"
      },...
    ]
  }
  ```
  ---- **_Pagination_** ----     
     - endpoint: `/proyek/:nomorKontrak?pageSize=10&currentPage=1`  
      will show 10 first laporan.  
      `pageSize` stand for how many laporan that can be shown in one page.  
      `currentPage` stand for laporan current page. 
     - body response:
     ```json
      {
          "status": "success",
          "data": [
            {
              "id": 2,
              "nama_vendor": "hdhdh",
              "id_datum": 69,
              "no_proyek": "8400001417",
              "nm_proyek": "Pekerjaan Tambahan Perintisan Jalan Tanah Liat Paccola",
              "no_kontrak": "0987654321"
            },..
          ],
              "page": {
              "page_size": "2",
              "total_rows": "19",
              "total_pages": 10,
              "currentPage": "1"
          }
      }
    ```
  ---- **_Search_** ----    
  - endpoint: `/proyek/:nomorKontrak?search=brillianita`  
  will filter the proyek and only show the proyek within `search` Brillianita 

- Get laporan by noProyek
  - method: `GET`
  - endpoint: `/laporan/:noProyek`
  - authorization: 
    - type: `Bearer Token`,
    - token: `accessToken`
  - body response:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 2,
        "jenis_laporan": "Laporan mingguan",
        "urutan_lap": 1,
        "nama_vendor": "hdhdh",
        "catatan": "Revisi",
        "status": "Ditinjau",
        "id_datum": 69,
        "no_proyek": "8400001417",
        "nm_proyek": "Pekerjaan Tambahan Perintisan Jalan Tanah Liat Paccola"
      },...
    ]
  }
  ```
  ---- **_Pagination_** ----     
     - endpoint: `/laporan/:noProyek?pageSize=10&currentPage=1`  
      will show 10 first laporan.  
      `pageSize` stand for how many laporan that can be shown in one page.  
      `currentPage` stand for laporan current page. 
     - body response:
     ```json
      {
          "status": "success",
          "data": [
            {
              "id": 2,
              "jenis_laporan": "Laporan mingguan",
              "urutan_lap": 1,
              "nama_vendor": "hdhdh",
              "catatan": "Revisi",
              "status": "Ditinjau",
              "id_datum": 69,
              "no_proyek": "8400001417",
              "nm_proyek": "Pekerjaan Tambahan Perintisan Jalan Tanah Liat Paccola"
            },..
          ],
              "page": {
              "page_size": "2",
              "total_rows": "19",
              "total_pages": 10,
              "currentPage": "1"
          }
      }
    ```
  ---- **_Search_** ----    
  - endpoint: `/laporan/:noProyek?search=brillianita`  
  will filter the proyek and only show the proyek within `search` Brillianita 

- Get laporan By Id laporan
  - method: `GET`
  - endpoint: `/detailLaporan/:id`,
  - authorization: 
    - type: `Bearer Token`,
    - token: `accessToken`
  - body response: 
  ```json
    {
        "status": "success",
        "data": [
          {
            "id": 2,
            "jenis_laporan": "Laporan mingguan",
            "urutan_lap": 1,
            "nama_vendor": "hdhdh",
            "catatan": "Revisi",
            "status": "Ditinjau",
            "id_datum": 69,
            "no_proyek": "8400001417",
            "nm_proyek": "Pekerjaan Tambahan Perintisan Jalan Tanah Liat Paccola"
          },
        ]
    }
  ```

- Create Laporan
  - method: `POST`
  - endpoint: `/laporan/tambah`,
  - Authorization:
    - type: `Bearer Token`,
    - token: `accessToken`
  - body request:
  ```json
    { 
      "file": FILE | required,
      "jenisLaporan" : string | required,
      "urutanLap" : integer | required for laporan harian, bulanan, mingguan, 
      "noProyek": string | required,
      "namaVendor": string |required,
    }
  ```
  - body response: 
  ```json
  {
    "status": "success",
    "message": "laporan has been created successfully"
  }
  ````

- Update Laporan
  - method: `PUT`
  - endpoint: `/laporan/edit/:id`,
  - Authorization:
    - type: `Bearer Token`,
    - token: `accessToken`
  - body request:
  ```json
    { 
      "file": FILE | required,
      "jenisLaporan" : string | required,
      "urutanLap" : integer | required for laporan harian, bulanan, mingguan, 
      "noProyek": string | required,
      "namaVendor": string |required,
    }
  ```
  - body response: 
  ```json
  {
    "status": "success",
    "message": "laporan has been updated successfully"
  }
  ```` 

### Accessing Laporan (For Admin or Staff)
- Get All Proyek
  - method: `GET`
  - endpoint: `/allProyek/`
  - authorization: 
    - type: `Bearer Token`,
    - token: `accessToken`
  - body response:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 3,
        "nama_vendor": "hdhdh",
        "id_datum": 69,
        "no_proyek": "8400001417",
        "nm_proyek": "Pekerjaan Tambahan Perintisan Jalan Tanah Liat Paccola",
        "no_kontrak": "0987654321"
      },...
    ]
  }
  ```
  ---- **_Pagination_** ----     
     - endpoint: `/allProyek?pageSize=10&currentPage=1`  
      will show 10 first proyek.  
      `pageSize` stand for how many proyek that can be shown in one page.  
      `currentPage` stand for proyek current page. 
     - body response:
     ```json
      {
          "status": "success",
          "data": [
            {
              "id": 3,
              "nama_vendor": "hdhdh",
              "id_datum": 69,
              "no_proyek": "8400001417",
              "nm_proyek": "Pekerjaan Tambahan Perintisan Jalan Tanah Liat Paccola",
              "no_kontrak": "0987654321"
            },..
          ],
              "page": {
              "page_size": "2",
              "total_rows": "19",
              "total_pages": 10,
              "currentPage": "1"
          }
      }
    ```
  ---- **_Search_** ----    
  - endpoint: `/allProyek?search=brillianita`  
  will filter the proyek and only show the proyek within `search` Brillianita 

- Get laporan By Id laporan
  - method: `GET`
  - endpoint: `/detailLaporan/:id`,
  - authorization: 
    - type: `Bearer Token`,
    - token: `accessToken`
  - body response: 
  ```json
    {
        "status": "success",
        "data": [
          {
            "id": 2,
            "jenis_laporan": "Laporan mingguan",
            "urutan_lap": 1,
            "nama_vendor": "hdhdh",
            "catatan": "Revisi",
            "status": "Ditinjau",
            "id_datum": 69,
            "file": "1675664049731-test-form bakp.pdf",
            "created_at": "2023/02/05",
            "no_proyek": "8400001417",
            "nm_proyek": "Pekerjaan Tambahan Perintisan Jalan Tanah Liat Paccola"
          },
        ]
    }
  ```
- Get Recap
  - method: `GET`
  - endpoint: `/allLaporan/:noProyek`
  - authorization: 
    - type: `Bearer Token`,
    - token: `accessToken`
  - body response:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 2,
        "jenis_laporan": "Laporan mingguan",
        "urutan_lap": 1,
        "nama_vendor": "hdhdh",
        "catatan": "Revisi",
        "status": "Ditinjau",
        "id_datum": 69,
        "file": "BASEURL/1675664049731-test-form bakp.pdf",
        "created_at": "2023/02/05",
        "no_proyek": "8400001417",
        "nm_proyek": "Pekerjaan Tambahan Perintisan Jalan Tanah Liat Paccola"
      },...
    ]
  }
  ```
  ---- **_Pagination_** ----     
     - endpoint: `/allLaporan/:noProyek?pageSize=10&currentPage=1`  
      will show 10 first laporan.  
      `pageSize` stand for how many laporan that can be shown in one page.  
      `currentPage` stand for laporan current page. 
     - body response:
     ```json
      {
          "status": "success",
          "data": [
            {
              "id": 2,
              "jenis_laporan": "Laporan mingguan",
              "urutan_lap": 1,
              "nama_vendor": "hdhdh",
              "catatan": "Revisi",
              "status": "Ditinjau",
              "id_datum": 69,
              "file": "BASEURL/1675664049731-test-form bakp.pdf",
              "created_at": "2023/02/05",
              "no_proyek": "8400001417",
              "nm_proyek": "Pekerjaan Tambahan Perintisan Jalan Tanah Liat Paccola"
            },..
          ],
              "page": {
              "page_size": "2",
              "total_rows": "19",
              "total_pages": 10,
              "currentPage": "1"
          }
      }
    ```
  ---- **_Search_** ----    
  - endpoint: `/allLaporan/:noProyek?search=brillianita`  
  will filter the laporan and only show the laporan within `search` Brillianita 

- Get laporan By Id laporan
  - method: `GET`
  - endpoint: `/detailLaporan/:id`,
  - authorization: 
    - type: `Bearer Token`,
    - token: `accessToken`
  - body response: 
  ```json
    {
        "status": "success",
        "data": [
          {
            "id": 2,
            "jenis_laporan": "Laporan mingguan",
            "urutan_lap": 1,
            "nama_vendor": "hdhdh",
            "catatan": "Revisi",
            "status": "Ditinjau",
            "id_datum": 69,
            "file": "1675664049731-test-form bakp.pdf",
            "created_at": "2023/02/05",
            "no_proyek": "8400001417",
            "nm_proyek": "Pekerjaan Tambahan Perintisan Jalan Tanah Liat Paccola"
          },
        ]
    }
  ```

- Update Laporan stat
  - method: `PUT`
  - endpoint: `/laporanStat/edit/:id`,
  - Authorization:
    - type: `Bearer Token`,
    - token: `accessToken`
  - body request:
  ```json
    { 
      "status": string | required,
      "catatan": string |required,
    }
  ```
  - body response: 
  ```json
  {
    "status": "success",
    "message": "status has been updated successfully"
  }
  ````              
- Delete Laporan 
  - method: `DELETE`
  - endpoint: `/laporan/:id`,
  - Authorization:
    - type: `Bearer Token`,
    - token: `accessToken`
  - body response: 
  ```json
  {
    "status": "success",
    "message": "laporan laporan has been deleted!"
  }
  ````  

### Accessing dropdown nomor & nama proyek
- Get Recap
  - method: `GET`
  - endpoint: `/noNmProyek`
  - authorization: 
    - type: `Bearer Token`,
    - token: `accessToken`
  - body response:
  ```json
  {
    "status": "success",
    "data": []
  }
  ```
  ---- **_noKontrak_** ----    
  - endpoint: `/noNmProyek?noKontrak=12845985`  
  will filter the laporan and only show the laporan within `noKontrak` 12845985 
  - body response: 
  ```json
  {
    "status": "success",
    "data": [
      {
        "no_proyek": "8600013766",
        "no_kontrak": "12845985"
      },...
    ]
  }
  ```
  ---- **_noProyek_** ----    
  - endpoint: `/noNmProyek?noKontrak=12845985&noProyek=8600013766`  
  will filter the laporan and only show the laporan within `noKontrak` 12845985 and `noProyek` 8600013766 
  - body response: 
  ```json
  {
    "status": "success",
    "data": [
      {
        "no_proyek": "8600013766",
        "nm_proyek": "Jasa Perbaikan IPAL seksi Rumah Tangga",
        "no_kontrak": "12845985"
      },...
    ]
  }
  ```        
  
  ### Accessing Dashboard (For Admin)
- Get Statistik project data
  - method: `GET`
  - endpoint: `/stat/data?tahun=2021`
  - authorization: 
    - type: `Soon`,
    - token: `Soon`
  - body response:
  ```json
  {
    "status": "success",
    "data": {
        "totalproject": "26",
        "completed": "24",
        "preparing": "0",
        "inpro": "2",
        "opex": "Rp 4.263.916.373,00",
        "capex": "Rp 38.713.465.553,00",
        "persenComp": [
            "92.3",
            "7.7"
        ],
        "persenInpro": [
            "7.7",
            "92.3"
        ],
        "persenprep": [
            "0.0",
            "100.0"
        ]
    }
  }
  ```

- Get Statistik Plan Actual By Id Datum
  - method: `GET`
  - endpoint: `/stat/planactual/78`
  - authorization: 
    - type: `Soon`,
    - token: `Soon`
  - body response:
  ```json
  {
    "status": "success",
    "data": {
      "idDatum": "78",
      "totalWeek": 26,
      "arrOfchart": [
          {
              "week": 1,
              "plan": 0.2,
              "actual": 0.12
          },
          {
              "week": 2,
              "plan": 0.3,
              "actual": 0.24
          },
          ...
        ]
    }
  }
  ```
  
  - Get Statistik Monitoring PR
  - method: `GET`
  - endpoint: `/stat/monPr`
  - authorization: 
    - type: `Soon`,
    - token: `Soon`
  - body response:
  ```json
  {
    "status": "success",
    "data": {
        "chart": {
            "tender": "7",
            "po": "31",
            "evalkom": "5",
            "evaltek": "1",
            "approval_pr": "0",
            "submit_eproc": "0",
            "eval_ece": "0",
            "eceboq": "1",
            "not_set": "0"
          }
      }
  }
  ```
  
 - Get Statistik Monitoring PR PIC
  - method: `GET`
  - endpoint: `/stat/picpr`
  - authorization: 
    - type: `Soon`,
    - token: `Soon`
  - body response:
  ```json
  {
    "status": "success",
    "data": {
        "chart": {
            "user": "2.2",
            "rbcapex": "2.2",
            "pengadaan": "26.7",
            "konstruksi": "68.9",
            "not_set": "0.0"
        }
    }
  }
  ```

- Get Statistik PKO
  - method: `GET`
  - endpoint: `/stat/pko?tahun=2021`
  - authorization: 
    - type: `Soon`,
    - token: `Soon`
  - body response:
  ```json
  {
    "status": "success",
    "data": {
        "qty": {
            "completed": "47",
            "inpro": "4",
            "pending": "0"
        },
        "rp": {
            "outstand": "Rp 761.418.925,00",
            "realisasi": "Rp 1.425.689.820,00",
            "bapp": "Rp 664.270.895,00"
        }
    }
  }
  ```
