const vscode = require('vscode');
const { exec } = require('child_process');

let state = '待機中';
let url = '';

function activate(context) {
	// 拡張が有効になったときに実行されるコード

	// 状態が「待機中」のときの処理
	if (state === '待機中') {
		// "register problem" ボタンを作成し、クリックイベントを設定する
		const registerProblemButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
		registerProblemButton.text = '$(rocket) Register Problem';
		registerProblemButton.command = 'extension.registerProblem';
		registerProblemButton.show();

		// "register problem" ボタンがクリックされたときの処理
		context.subscriptions.push(vscode.commands.registerCommand('extension.registerProblem', () => {
			// テキストボックスと submit ボタンを表示する
			vscode.window.showInputBox({ prompt: 'Enter the URL:' }).then((input) => {
				if (input) {
					url = input;
					executeCommand(`C://Users/kaito/auto-sample-checker/s.bat ${url}`);
					state = '実装中';
					updateStatusBarButton();
				}
			});
		}));
	}

	// "test sample case" ボタンを作成し、クリックイベントを設定する
	const testSampleCaseButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	testSampleCaseButton.text = '$(play) Test Sample Case';
	testSampleCaseButton.command = 'extension.testSampleCase';
	// testSampleCaseButton.show();

	// "test sample case" ボタンがクリックされたときの処理
	context.subscriptions.push(vscode.commands.registerCommand('extension.testSampleCase', () => {
		if (state === '実装中') {
			executeCommand(`C://Users/kaito/auto-sample-checker/r.bat ${url}`);
		}
	}));

	// ステータスバーのボタンの表示を更新する関数
	function updateStatusBarButton() {
		if (state === '実装中') {
			testSampleCaseButton.show();
		} else {
			testSampleCaseButton.hide();
		}
	}

	// コマンドを実行する関数
	function executeCommand(command) {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.log(`${stderr}`);
				console.error(`Error executing command: ${command}`);
				return;
			}
			vscode.window.showInformationMessage(stdout)
			// if (stdout.includes('SUCCESS')) {
			// 	vscode.window.showInformationMessage('Test passed');
			// } else {
			// 	vscode.window.showWarningMessage(state);
			// }
		});
	}
}
exports.activate = activate;