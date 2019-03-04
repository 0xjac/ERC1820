#! /bin/bash

BATCHSIZE=${1-128}
BATCHSIZE_ITER=$((${BATCHSIZE} - 1))
ITERATIONS=${2-90863}


rm -rf tmp
mkdir tmp
for i in `seq 0 ${BATCHSIZE_ITER}`; do
    mkdir -p "./tmp/${i}/contracts"
    cp contracts/ERC820aRegistry.sol "./tmp/${i}/contracts/"
done

for OFFSET in `seq 0 $BATCHSIZE $ITERATIONS`; do
    for VALUE in `seq 0 ${BATCHSIZE_ITER}`; do
        IV=$((${OFFSET} + ${VALUE}))
        sed -i '' -Ee "s/^\/\/ IV:.+$/\/\/ IV: $((${IV}))/1" "tmp/${VALUE}/contracts/ERC820aRegistry.sol"
        pushd "./tmp/${VALUE}" > /dev/null
        solc --overwrite --optimize --optimize-runs 200 --metadata-literal --output-dir ./artifacts \
            --combined-json abi,bin ./contracts/ERC820aRegistry.sol >/dev/null &
        popd > /dev/null
    done
    wait

    node scripts/vanitygen-info.js "${OFFSET}" "${BATCHSIZE}" | tee -a addrs.txt
done
