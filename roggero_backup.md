# Configuración de Backup Mensual para Roggero & Roma (Instrucciones para Hermes)

**Contexto para Hermes (Agent):** Eres el agente residente en la VPS. Tu tarea es configurar un sistema automatizado de backups mensuales para el proyecto "Property Pulse" (Roggero & Roma). Este sistema debe resguardar la Base de Datos (MongoDB), el repositorio de código (GitHub) y los archivos multimedia (Cloudinary).

Por favor, sigue estas instrucciones paso a paso para configurar el entorno, crear el script y programar el Cronjob.

---

## Paso 1: Preparación del Entorno y Dependencias

Necesitamos asegurarnos de que la VPS tenga instaladas las siguientes herramientas. Ejecuta los comandos correspondientes según tu distribución de Linux (asumiendo Ubuntu/Debian):

1. **MongoDB Database Tools** (Para tener acceso a `mongodump`):
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-database-tools
   ```

2. **Git** (Para el backup del repositorio):
   ```bash
   sudo apt-get install -y git
   ```

3. **Python3 y PIP** (Para usar la CLI oficial de Cloudinary):
   ```bash
   sudo apt-get install -y python3-pip
   pip3 install cloudinary-cli
   ```

---

## Paso 2: Crear el Directorio de Backups

Crea un directorio seguro donde se almacenarán los scripts y los archivos comprimidos.

```bash
sudo mkdir -p /opt/roggero_backups/archives
sudo mkdir -p /opt/roggero_backups/data/github
sudo chown -R $USER:$USER /opt/roggero_backups
```

---

## Paso 3: Configurar Credenciales

### 1. Configurar Cloudinary CLI
Exporta la URL de Cloudinary para que la CLI sepa a dónde conectarse. Reemplaza `<CLOUDINARY_URL>` con la URL real (formato: `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`).

```bash
export CLOUDINARY_URL="<CLOUDINARY_URL>"
cld config
```

### 2. Archivo de Variables de Entorno para el Script
Crea un archivo oculto con las credenciales para el script en `/opt/roggero_backups/.env_backup`:

```bash
cat << 'EOF' > /opt/roggero_backups/.env_backup
# Credenciales de MongoDB
MONGO_URI="mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/?appName=property-pulse"

# Credenciales de GitHub
GIT_REPO="https://<GITHUB_PAT>@github.com/Ziramog/properties.git"

# Credenciales de Cloudinary
export CLOUDINARY_URL="cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>"
EOF

chmod 600 /opt/roggero_backups/.env_backup
```
*(Nota para el Humano: Deberás editar `/opt/roggero_backups/.env_backup` y colocar tus contraseñas reales, la URI de Mongo, y generar un Personal Access Token (PAT) de GitHub).*

---

## Paso 4: Crear el Script de Backup (`backup.sh`)

Crea el archivo `/opt/roggero_backups/backup.sh` con el siguiente contenido:

```bash
#!/bin/bash

# Cargar variables de entorno
source /opt/roggero_backups/.env_backup

# Variables de tiempo y directorios
DATE=$(date +"%Y-%m-%d")
BASE_DIR="/opt/roggero_backups"
TEMP_DIR="$BASE_DIR/temp_$DATE"
ARCHIVE_DIR="$BASE_DIR/archives"

echo "=== Iniciando Backup Mensual: $DATE ==="

# 1. Crear directorio temporal
mkdir -p "$TEMP_DIR"

# 2. Backup de MongoDB
echo "[1/3] Extrayendo base de datos MongoDB..."
mongodump --uri="$MONGO_URI" --gzip --out="$TEMP_DIR/mongodb_dump"

# 3. Backup de GitHub (Mirror)
echo "[2/3] Sincronizando repositorio de GitHub..."
if [ -d "$BASE_DIR/data/github/properties.git" ]; then
    cd "$BASE_DIR/data/github/properties.git" && git remote update
else
    git clone --mirror "$GIT_REPO" "$BASE_DIR/data/github/properties.git"
fi
# Copiar el repositorio actualizado al directorio temporal
cp -r "$BASE_DIR/data/github/properties.git" "$TEMP_DIR/github_repo.git"

# 4. Backup de Cloudinary
echo "[3/3] Sincronizando imágenes de Cloudinary..."
# Sincroniza desde la nube al directorio temporal (pull true, push false)
cld sync --push false --pull true "$TEMP_DIR/cloudinary_images" "roggero-roma"

# 5. Comprimir todo
echo "Comprimiendo archivos..."
tar -czf "$ARCHIVE_DIR/roggero_backup_$DATE.tar.gz" -C "$BASE_DIR" "temp_$DATE"

# 6. Limpieza
echo "Limpiando archivos temporales..."
rm -rf "$TEMP_DIR"

# 7. Rotación (Opcional): Borrar backups locales mayores a 90 días
find "$ARCHIVE_DIR" -name "*.tar.gz" -type f -mtime +90 -exec rm {} \;

echo "=== Backup finalizado con éxito: roggero_backup_$DATE.tar.gz ==="
```

Dale permisos de ejecución al script:
```bash
chmod +x /opt/roggero_backups/backup.sh
```

---

## Paso 5: Programar el Cronjob

Añade el script al cronjob del usuario para que se ejecute el día 1 de cada mes a las 03:00 AM.

Ejecuta:
```bash
crontab -e
```

Añade la siguiente línea al final del archivo:
```bash
0 3 1 * * /opt/roggero_backups/backup.sh >> /opt/roggero_backups/backup.log 2>&1
```

---

**Hermes:** Una vez hayas seguido todos estos pasos e instalado las dependencias, solicita al humano que rellene el archivo `.env_backup` con los secretos reales. Luego, puedes probar el sistema ejecutando manualmente `/opt/roggero_backups/backup.sh`.
