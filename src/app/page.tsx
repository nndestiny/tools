"use client";

import {
  Button,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import classNames from "classnames";
import { useCallback, useState } from "react";
import {
  Chain,
  createWalletClient,
  Hex,
  http,
  isAddress,
  parseEther,
  SendTransactionErrorType,
  stringToHex,
  webSocket,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

import Log from "@/components/Log";
import { ChainKey, inscriptionChains } from "@/config/chains";
import useInterval from "@/hooks/useInterval";
import { handleAddress, handleLog } from "@/utils/helper";

const example =
  'data:,{"p":"asc-20","op":"mint","tick":"aval","amt":"100000000"}';

type RadioType = "meToMe" | "manyToOne";

type GasRadio = "all" | "tip";

export default function Home() {
  const [chain, setChain] = useState<Chain>(mainnet);
  const [privateKeys, setPrivateKeys] = useState<Hex[]>([]);
  const [radio, setRadio] = useState<RadioType>("meToMe");
  const [toAddress, setToAddress] = useState<Hex>();
  const [rpc, setRpc] = useState<string>();
  const [inscription, setInscription] = useState<string>("");
  const [gas, setGas] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [delay, setDelay] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [gasRadio, setGasRadio] = useState<GasRadio>("all");

  const pushLog = useCallback((log: string, state?: string) => {
    setLogs(logs => [
      handleLog(log, state),
      ...(logs.length >= 1000 ? logs.slice(0, 1000) : logs),
    ]);
  }, []);

  const client = createWalletClient({
    chain,
    transport: rpc && rpc.startsWith("wss") ? webSocket(rpc) : http(rpc),
  });
  const accounts = privateKeys.map(key => privateKeyToAccount(key));

  useInterval(
    async () => {
      const results = await Promise.allSettled(
        accounts.map(account => {
          return client.sendTransaction({
            account,
            to: radio === "meToMe" ? account.address : toAddress,
            value: 0n,
            ...(inscription
              ? {
                  data: stringToHex(inscription),
                }
              : {}),
            ...(gas > 0
              ? gasRadio === "all"
                ? {
                    gasPrice: parseEther(gas.toString(), "gwei"),
                  }
                : {
                    maxPriorityFeePerGas: parseEther(gas.toString(), "gwei"),
                  }
              : {}),
          });
        }),
      );
      results.forEach((result, index) => {
        const address = handleAddress(accounts[index].address);
        if (result.status === "fulfilled") {
          pushLog(`${address} ${result.value}`, "success");
          setSuccessCount(count => count + 1);
        }
        if (result.status === "rejected") {
          const e = result.reason as SendTransactionErrorType;
          let msg = `${e.name as string}: `;
          if (e.name === "TransactionExecutionError") {
            msg = msg + e.details;
          }
          if (e.name == "Error") {
            msg = msg + e.message;
          }
          pushLog(`${address} ${msg}`, "error");
        }
      });
    },
    running ? delay : null,
  );

  const run = useCallback(() => {
    if (privateKeys.length === 0) {
      pushLog("没有私钥", "error");
      setRunning(false);
      return;
    }

    if (radio === "manyToOne" && !toAddress) {
      pushLog("没有地址", "error");
      setRunning(false);
      return;
    }

    // if (!inscription) {
    //   setLogs((logs) => [handleLog("没有铭文", "error"), ...logs]);
    //   setRunning(false);
    //   return;
    // }

    setRunning(true);
  }, [privateKeys.length, pushLog, radio, toAddress]);

  return (
    <div className="flex flex-col gap-7 pt-8 lg:px-[160px] lg:bg-[#171A1F] lg:border lg:border-[#2A2F37] lg:border-solid rounded-3xl mb-[50px]">
      <div className="text-2xl font-medium">Inscription</div>
      <div className=" flex flex-col gap-[6px]">
        <span>链（选要打铭文的链）:</span>
        <TextField
          select
          defaultValue="eth"
          size="small"
          disabled={running}
          onChange={e => {
            const text = e.target.value as ChainKey;
            setChain(inscriptionChains[text]);
          }}
        >
          {Object.entries(inscriptionChains).map(([key, chain]) => (
            <MenuItem key={chain.id} value={key}>
              {chain.name}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className=" flex flex-col gap-[6px]">
        <span>私钥（必填，每行一个）:</span>
        <TextField
          multiline
          minRows={2}
          size="small"
          placeholder="私钥，带不带 0x 都行，程序会自动处理"
          disabled={running}
          onChange={e => {
            const text = e.target.value;
            const lines = text.split("\n");
            const keys = lines
              .map(line => {
                const key = line.trim();
                if (/^[a-fA-F0-9]{64}$/.test(key)) {
                  return `0x${key}`;
                }
                if (/^0x[a-fA-F0-9]{64}$/.test(key)) {
                  return key as Hex;
                }
              })
              .filter(x => x) as Hex[];
            setPrivateKeys(keys);
          }}
        />
      </div>

      <RadioGroup
        row
        defaultValue="meToMe"
        onChange={e => {
          const value = e.target.value as RadioType;
          setRadio(value);
        }}
      >
        <FormControlLabel
          value="meToMe"
          control={<Radio />}
          label="自转"
          disabled={running}
        />
        <FormControlLabel
          value="manyToOne"
          control={<Radio />}
          label="多转一"
          disabled={running}
        />
      </RadioGroup>

      {radio === "manyToOne" && (
        <div className=" flex flex-col gap-[6px]">
          <span>转给谁的地址（必填）:</span>
          <TextField
            size="small"
            placeholder="地址"
            disabled={running}
            onChange={e => {
              const text = e.target.value;
              isAddress(text) && setToAddress(text);
            }}
          />
        </div>
      )}

      <div className=" flex flex-col gap-[6px]">
        <span>铭文（选填，原始铭文，不是转码后的十六进制）:</span>
        <TextField
          size="small"
          placeholder={`铭文，不要输入错了，多检查下，例子：\n${example}`}
          disabled={running}
          onChange={e => {
            const text = e.target.value;
            setInscription(text.trim());
          }}
        />
      </div>

      <div className=" flex flex-col gap-[6px]">
        <span>
          RPC (选填, 默认公共有瓶颈经常失败, 最好用付费的, http 或者 ws 都可以):
        </span>
        <TextField
          size="small"
          placeholder="RPC"
          disabled={running}
          onChange={e => {
            const text = e.target.value;
            setRpc(text);
          }}
        />
      </div>

      <RadioGroup
        row
        defaultValue="all"
        onChange={e => {
          const value = e.target.value as GasRadio;
          setGasRadio(value);
        }}
      >
        <FormControlLabel
          value="all"
          control={<Radio />}
          label="总 gas"
          disabled={running}
        />
        <FormControlLabel
          value="tip"
          control={<Radio />}
          label="额外矿工小费"
          disabled={running}
        />
      </RadioGroup>

      <div className=" flex flex-col gap-[6px]">
        <span>{gasRadio === "tip" ? "额外矿工小费" : "总 gas"} (选填):</span>
        <TextField
          type="number"
          size="small"
          placeholder={`${
            gasRadio === "tip" ? "默认 0" : "默认最新"
          }, 单位 gwei，例子: 10`}
          disabled={running}
          onChange={e => {
            const num = Number(e.target.value);
            !Number.isNaN(num) && num >= 0 && setGas(num);
          }}
        />
      </div>

      <div className=" flex flex-col gap-[6px]">
        <span>每笔交易间隔时间 (选填, 最低 0 ms):</span>
        <TextField
          type="number"
          size="small"
          placeholder="默认 0 ms"
          disabled={running}
          onChange={e => {
            const num = Number(e.target.value);
            !Number.isNaN(num) && num >= 0 && setDelay(num);
          }}
        />
      </div>

      <Button
        variant="contained"
        color={running ? "error" : "success"}
        className={classNames(
          "transition h-[52px] rounded-[26px] text-[18px] font-semibold",
          running
            ? "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"
            : "bg-gradient-to-r from-teal-400 via-lime-300 to-yellow-400",
        )}
        onClick={() => {
          // setRunning(prevState => !prevState);
          // return;
          if (!running) {
            run();
          } else {
            setRunning(false);
          }
        }}
      >
        {running ? (
          <div className="leading-[25px]">
            运行中
            <div className="text-xs font-normal leading-[17px]">点击暂停</div>
          </div>
        ) : (
          "运行"
        )}
      </Button>

      <Log
        title={`日志（成功次数 => ${successCount}）:`}
        logs={logs}
        onClear={() => {
          setLogs([]);
        }}
      />

      <div className="pt-8 pb-[100px] text-center">致敬cybervector_</div>
    </div>
  );
}
