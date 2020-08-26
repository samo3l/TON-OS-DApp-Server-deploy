#!/bin/bash -eE

. "${SCRIPT_DIR}/env.sh"

cd "${DOCKER_COMPOSE_DIR}/ELK" && docker-compose up -d

sed -i "s|yourdomain.com|${HOSTNAME}|g" "${DOCKER_COMPOSE_DIR}/arangodb/docker-compose.yml"
sed -i "s|email for notification|${EMAIL_FOR_NOTIFICATIONS}|g" "${DOCKER_COMPOSE_DIR}/arangodb/docker-compose.yml"
sed -i "s|NETWORK_TYPE.*|NETWORK_TYPE=${NETWORK_TYPE}|g" "${DOCKER_COMPOSE_DIR}/arangodb/.env"

sed -i "s|host.yourdomain.com|${HOSTNAME}|g" "${DOCKER_COMPOSE_DIR}/web.root/.env"
sed -i "s|for notification|${EMAIL_FOR_NOTIFICATIONS}|g" "${DOCKER_COMPOSE_DIR}/web.root/docker-compose.yml"

rm -f "${DOCKER_COMPOSE_DIR}/proxy/htpasswd/arango.yourdomain.com"
echo "admin:\$apr1\$d0ifqbt3\$iayulpIOP2.IS4Sy1I2zJ0" >"${DOCKER_COMPOSE_DIR}/proxy/htpasswd/arango.${HOSTNAME}"
echo "#iJJ9fWxb9Z6CS1aPagoW" >>"${DOCKER_COMPOSE_DIR}/proxy/htpasswd/arango.${HOSTNAME}"
echo "admin:\$apr1\$d0ifqbt3\$iayulpIOP2.IS4Sy1I2zJ0" >"${DOCKER_COMPOSE_DIR}/proxy/htpasswd/arangoni.${HOSTNAME}"
echo "#iJJ9fWxb9Z6CS1aPagoW" >>"${DOCKER_COMPOSE_DIR}/proxy/htpasswd/arangoni.${HOSTNAME}"
mv "${DOCKER_COMPOSE_DIR}/proxy/vhost.d/host.yourdomain.com" "${DOCKER_COMPOSE_DIR}/proxy/vhost.d/${HOSTNAME}" || true

for BUNDLE_COMPONENT in proxy web.root arangodb; do
    cd "${DOCKER_COMPOSE_DIR}/${BUNDLE_COMPONENT}/" && docker-compose up -d
done

rm -rf "${DOCKER_COMPOSE_DIR}/q-server/build/ton-q-server"
cd "${DOCKER_COMPOSE_DIR}/q-server/build" && git clone "${TON_Q_SERVER_GITHUB_REPO}"
cd "${DOCKER_COMPOSE_DIR}/q-server/build/ton-q-server" && git checkout "${TON_Q_SERVER_GITHUB_COMMIT_ID}"
cd "${DOCKER_COMPOSE_DIR}/q-server" && docker-compose up -d


echo "INFO: Waiting for Kafka start..."
cd "${DOCKER_COMPOSE_DIR}/kafka" || exit 1
OK=0
while [ $OK -ne 100 ]; do
    docker-compose up -d >"${TMP_DIR}/kafka.log" 2>&1
    OK=$(awk '
        BEGIN { fail = 0 }
        {
            if ($1 == "ERROR:") {
                fail = fail + 1
            }
        }
        END {
            if (fail != 0) {
                print 0
            } else {
                print 100
            }
        }
    ' "${TMP_DIR}/kafka.log")
done
rm -f "${TMP_DIR}/kafka.log"

OK=0
while [ $OK -ne 100 ]; do
    if [[ `docker ps | grep check-connect | grep  healthy` == *"healthy"* ]]; then
        OK=100
    fi
    sleep 10s
done

until [ "$(echo "${IntIP}" | grep "\." -o | wc -l)" -eq 3 ]; do
    set +e
    IntIP="$(curl -sS ipv4bot.whatismyipaddress.com)":${ADNL_PORT}
    set -e
    echo "INFO: IntIP = $IntIP"
done
sed -i "s|IntIP.*|IntIP=${IntIP}|g" "${DOCKER_COMPOSE_DIR}/statsd/.env"
cd "${DOCKER_COMPOSE_DIR}/statsd/" && docker-compose up -d

sed -i "s|ADNL_PORT.*|ADNL_PORT=${ADNL_PORT}|" "${DOCKER_COMPOSE_DIR}/ton-node/.env"
sed -i "s|NETWORK_TYPE.*|NETWORK_TYPE=${NETWORK_TYPE}|" "${DOCKER_COMPOSE_DIR}/ton-node/.env"

rm -rf "${DOCKER_COMPOSE_DIR}/ton-node/build/ton-node"
cd "${DOCKER_COMPOSE_DIR}/ton-node/build" && git clone "${TON_NODE_GITHUB_REPO}" ton-node
cd "${DOCKER_COMPOSE_DIR}/ton-node/build/ton-node" && git checkout "${TON_NODE_GITHUB_COMMIT_ID}"

cd "${DOCKER_COMPOSE_DIR}/ton-node/" && docker-compose up -d
