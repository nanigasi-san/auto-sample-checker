const vscode = require('vscode');
const { exec } = require('child_process');
const path = require('path');


function activate(context) {
	// 拡張が有効になったときに実行されるコード

	// "register problem" ボタンを作成し、クリックイベントを設定する
	const registerProblemButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	registerProblemButton.text = '$(cloud-download) Register Problem';
	registerProblemButton.command = 'extension.registerProblem';
	registerProblemButton.show();
	
	// "test sample case" ボタンを作成し、クリックイベントを設定する
	const testSampleCaseButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	testSampleCaseButton.text = '$(watch) Test Sample Case';
	testSampleCaseButton.command = 'extension.testSampleCase';

	const submitCodeButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	submitCodeButton.text = '$(rocket) Submit Code';
	submitCodeButton.command = 'extension.submitCode';

	// "register problem" ボタンがクリックされたときの処理
	context.subscriptions.push(vscode.commands.registerCommand('extension.registerProblem', () => {
		let url = '';
		let downloaded = false;
		let passed = false;
		testSampleCaseButton.hide();
		submitCodeButton.hide();
		// テキストボックスと submit ボタンを表示する
		vscode.window.showInputBox({ prompt: 'Enter the URL:' }).then((input) => {
			if (input) {
				url = input;
				executeCommand(`rmdir /s /q cases`);
				executeCommand(`oj download ${url} -d cases/`);
				vscode.window.showInformationMessage('Download sample cases.');
				testSampleCaseButton.show();
			}
		});
	}));

	// "test sample case" ボタンがクリックされたときの処理
	context.subscriptions.push(vscode.commands.registerCommand('extension.testSampleCase', () => {
		submitCodeButton.hide();
		console.log('pushed test');
		const current_file = vscode.window.activeTextEditor.document.uri.fsPath;
		console.log(`now file: ${current_file}`);
		console.log(__dirname, __filename, process.cwd());
		executeCommand(`oj test -c \"python ${path.resolve(current_file)}\" -d cases/`);
	}));

	// コマンドを実行する関数
	function executeCommand(command) {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing command: ${command}`);
				console.log(`[stdout]\n${stdout}\n-------------`);
				console.error(`[stderr]\n${stderr}\n-------------`);

				if (stdout.includes('test failed')) {
					vscode.window.showErrorMessage("Fail sample cases");
				} else {
					vscode.window.showErrorMessage("Chimpo");
				}
			}
			console.log(stdout, stderr);
			if (stdout.includes('test success')) {
				vscode.window.showInformationMessage("Pass sample cases");
				submitCodeButton.show();
			}
		});
	}
}
exports.activate = activate;
