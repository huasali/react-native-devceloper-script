import os
import time
import subprocess
from git.repo import Repo

project_name = 'TheBull'    # 项目名称
scheme_name  = 'TheBull'    # Target
version      = '2.4.0'    # 版本号
buildVerison = '1'
export_directory = './ios/archive'    # 输出的文件夹
Fir_token = '05b6d87c450d837f895f1d377de3c9aa'

class AutoArchive(object):
    
    def __init__(self):
        pass
        
    def cmdLog(self,log):
        print("\033[1;32m[AutoArchive]%s\033[0m" % log)
        
    def commandRun(self,command):
        self.cmdLog("cmd:" + command)
        start = time.time()
        commandRun = subprocess.Popen(command, shell=True)
        commandRun.wait()
        end = time.time()
        resultCode = commandRun.returncode
        self.cmdLog("cmd:%s %d time:%.2f秒=======" % (command,resultCode,(end - start)))
        return resultCode
            
    def start(self):
        self.cmdLog("----------------配置环境----------------")
#        if self.commandRun('git pull') != 0 : return
        if self.commandRun('yarn run loadModule&&yarn run updateModuleId&&yarn run installModule') != 0 : return
        if self.commandRun('yarn updateJS&&yarn upgrade') != 0 : return
        if self.commandRun('yarn add lottie-react-native&&yarn add lottie-ios@3.2.3') != 0 : return
        if self.commandRun('cd ios&&rm Podfile.lock&&pod install&&cd ..') != 0 : return
        self.cmdLog("----------------打包RN代码----------------")
        if self.commandRun('yarn build ios') != 0 : return
        self.cmdLog("----------------配置Xcode----------------")
        if self.commandRun('xcodebuild clean -workspace ./ios/%s.xcworkspace -scheme %s -configuration Release' % (project_name, scheme_name)) != 0 : return
        if self.commandRun('ruby XcodeBuild.ruby %s %s %s' % (project_name,version,buildVerison)) != 0 : return
        self.cmdLog("----------------archive----------------")
        if self.commandRun('xcodebuild archive -workspace ./ios/%s.xcworkspace -scheme %s -configuration Release -archivePath %s/%s/%s' % (project_name, scheme_name, export_directory,fileName,project_name)) != 0 : return
        self.cmdLog("----------------exportArchive----------------")
#        if self.commandRun('xcodebuild -exportArchive -archivePath %s/%s/%s.xcarchive -exportPath %s/%s -exportOptionsPlist ./ios/plistPath/ExportOptions.plist -allowProvisioningUpdates YES' % (export_directory,fileName, project_name, export_directory, fileName)) != 0 : return

if __name__ == '__main__':
    fileName = time.time()
    start = time.time()
    archive = AutoArchive()
    archive.cmdLog("\n\n--------------start---------------")
    archive.start()
    end = time.time()
    archive.cmdLog("\n----------------ipa地址 %s/%s/%s.ipa" % (export_directory, fileName, scheme_name))
    archive.cmdLog("\n\n-------------- End ------------------\n总用时 time:%.2f秒=======" % (end - start));

