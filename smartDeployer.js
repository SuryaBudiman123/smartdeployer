require('dotenv').config();
const { ethers } = require('ethers');
const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

program
  .name("SmartDeployer")
  .description("CLI tool for deploying and managing smart contracts on Ethereum")
  .version("0.1.0");

program.command("deploy")
  .description("Deploy a smart contract")
  .action(async () => {
    const questions = [
      { type: 'input', name: 'contractABI', message: 'Contract ABI:' },
      { type: 'input', name: 'contractBytecode', message: 'Contract Bytecode:' },
      { type: 'input', name: 'providerURL', message: 'Ethereum Provider URL:' },
      { type: 'input', name: 'privateKey', message: 'Deployer Private Key:' },
    ];

    const answers = await inquirer.prompt(questions);
    const provider = new ethers.providers.JsonRpcProvider(answers.providerURL);
    const wallet = new ethers.Wallet(answers.privateKey, provider);
    const factory = new ethers.ContractFactory(answers.contractABI, answers.contractBytecode, wallet);

    try {
      console.log(chalk.blue("Deploying contract..."));
      const contract = await factory.deploy();
      await contract.deployed();
      console.log(chalk.green(`Contract deployed at: ${contract.address}`));
    } catch (error) {
      console.error(chalk.red(`Deployment error: ${error.message}`));
    }
  });

program.parse(process.argv);
