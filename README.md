# Hono.js Cloudflare Workers CRUD API

Bu proje, **Hono.js**, **Cloudflare Workers** ve **Cloudflare D1** kullanılarak geliştirilen basit bir **Post CRUD API**'sidir. Aşağıda, projeyi indirip nasıl çalıştıracağınız ve deploy edeceğiniz adım adım açıklanmıştır.

## Özellikler

- **Hono.js** ile oluşturulmuş serverless API.
- **Cloudflare Workers** platformu üzerinde çalışan edge computing.
- **Cloudflare D1** ile veritabanı işlemleri.
- Full CRUD (Create, Read, Update, Delete) API'si.

## Kurulum

### 1. Projeyi İndir

Projeyi GitHub'dan klonlayarak bilgisayarınıza indirin:

```bash
git clone https://github.com/theebestzz/hono-cloudflare-crud.git
cd hono-cloudflare-crud
```

### 2. Gerekli Bağımlılıkları Yükleyin

Projede kullanılan bağımlılıkları kurmak için, terminalinizde aşağıdaki komutu çalıştırın:

```bash
npm install
```

### 3. Cloudflare Wrangler Kurulumu

Bu proje, Cloudflare Workers ile çalıştığı için **wrangler** CLI aracını yüklemeniz gerekecek. Wrangler, Cloudflare Workers projelerini yönetmek için kullanılan bir araçtır.

Eğer **wrangler** kurulu değilse, şu komutla yükleyebilirsiniz:

```bash
npm install -g wrangler
```

## Cloudflare D1 Veritabanı Oluşturma

### Cloudflare Dashboard üzerinden bir D1 veritabanı oluşturmanız gerekiyor:

**1.** [Cloudflare Dashboard](https://dash.cloudflare.com) adresine gidin.
**2.** **_Workers_** sekmesinden yeni bir D1 veritabanı oluşturun.
**3.** Veritabanı ismini ve ID'sini kaydedin.

Bu adımda veritabanı adı ve ID bilgileri gerekecek, bunları **_wrangler.toml_** dosyasına ekleyeceğiz.

- name = "hono-cloudflare-crud"
- main = "src/index.ts"
- compatibility_date = "2024-10-11"

[[d1_databases]]

- binding = "DB" # Kodda kullanacağımız veritabanı bağlantı ismi
- database_name = "your-d1-database-name" # Cloudflare D1 veritabanı ismi
- database_id = "your-d1-database-id" # Veritabanı ID'si

**database_name ve database_id alanlarını, Cloudflare Dashboard'dan aldığınız bilgilerle doldurun.**

## Veritabanı Migrasyonlarını Uygulama

Veritabanı şemasını oluşturmak için Cloudflare D1 üzerinde migrasyonları uygulamamız gerekiyor. Aşağıdaki komutu çalıştırarak migrasyonları uygulayın:

```bash
wrangler d1 migrations apply your-d1-database-name
```

Bu komut, proje içinde tanımlı **_posts_** tablosunu veritabanınızda oluşturacaktır.

## Geliştirme Ortamı

### Localde Çalıştırma

Proje üzerinde localde çalışmak için **_wrangler dev_** komutunu kullanabilirsiniz. Bu komut, projenizi Cloudflare Workers üzerinde çalıştırır ve localde API'yi test etmenizi sağlar.

Bu komut sonrasında API'niz **http://localhost:8787** adresinde çalışıyor olacak.

## Deploy Etme

Projeyi **Cloudflare Workers** platformuna deploy etmek için şu adımları izleyin:

### 1. **_wrangler login_** komutu ile Cloudflare hesabınıza giriş yapın.

```bash
wrangler login
```

### 2. Aşağıdaki komut ile projenizi deploy edin:

```bash
wrangler deploy
```

Deploy işleminden sonra API'niz **_Cloudflare Workers_** üzerinde yayına girecek ve size verilen URL üzerinden API'nizi kullanabilirsiniz.

### Proje Yapısı

```
hono-cloudflare-crud/
├── src/
│   ├── api/
│   │   ├── postRoutes.ts     # Post CRUD işlemleri için API rotaları
│   ├── middleware/
│   │   ├── cors.ts           # CORS middleware
│   ├── index.ts              # Ana API giriş noktası (server)
├── migrations/               # Veritabanı migrasyon dosyaları
├── wrangler.toml             # Cloudflare yapılandırma dosyası
└── package.json              # Proje bağımlılıkları ve script'ler
```
