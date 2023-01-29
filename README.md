
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
SOON

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
        "status": "Success",
        "data": [{
            "id": 6,
            "jenis_pekerjaan": "electrical",
            "nama_pekerjaan": "tetsts",
            "nomor_kontrak": "9845985",
            "tgl_mulai": null,
            "tgl_selesai": null,
            "lokasi_pekerjaan": "makassar"
        },...
        ]
    }
    ```
  ---- **_Pagination_** ----     
     - endpoint: `/kontraktor?page_size=10&current_page=1`  
      will show 10 first kontraktors.  
      `page_size` stand for how many kontraktor that can be shown in one page.  
      `current_page` stand for kontraktor current page. 
     - body response:
      ```json
      {
          "status": "Success",
          "data": [
              {
                "id": 6,
                "jenis_pekerjaan": "electrical",
                "nama_pekerjaan": "tetsts",
                "nomor_kontrak": "9845985",
                "tgl_mulai": null,
                "tgl_selesai": null,
                "lokasi_pekerjaan": "makassar"
              },...
          ],
              "page": {
              "page_size": "2",
              "total_rows": "19",
              "total_pages": 10,
              "current_page": "1"
          }
      }

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
            "tgl_mulai": null,
            "tgl_selesai": null,
            "lokasi_pekerjaan": "makassar"
          }
      ]
  }
  ```
- Insert New Kontraktor
  - - method: `POST`
  - endpoint: `/kontraktor/tambah`,
  - Authorization:
    - type: `Bearer Token`,
    - token: `accessToken`
  - body request:
  ```json
    {
        "jenis_pekerjaan": string | required,
        "nama_pekerjaan": string | required,
        "nomor_kontrak": string | required,
        "lokasi_pekerjaan": string | required,
        "tgl_mulai": timestamp,
        "tgl_selesai": timestamp,
        "username": string | required,
        "password": string | required,
        "confirmPassword": string | required
    }
  ```
  - body response: 
  ```json
  {
    "Register successfull!"
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
        "status": "Success",
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
     - endpoint: `/admin?page_size=10&current_page=1`  
      will show 10 first admin.  
      `page_size` stand for how many admin that can be shown in one page.  
      `current_page` stand for admin current page. 
     - body response:
      ```json
      {
          "status": "Success",
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
              "current_page": "1"
          }
      }

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
      "data`": [
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
  - - method: `POST`
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
    "Register successfull!"
  }
  ````  