# -*- coding: UTF-8 -*-
require 'xcodeproj'
path                = "./ios/"
BundleId            = 'com.gongniu.smartHome'
developmentTeam     = 'GPZVG9WVZF'
provisioningProfile = 'smartHome_appstore'
#引入项目
projectName  = ARGV[0] 
targetName   = projectName
version      = ARGV[1] 
buildVerison = ARGV[2]
projectPath  = path + targetName + '.xcodeproj'
project = Xcodeproj::Project.open(projectPath)
puts "1.引入项目 project = #{project}:#{version}(#{buildVerison})"
#找到操作的target
targetIndex = 0
project.targets.each_with_index do |target, index|
  if target.name  == targetName
    targetIndex = index
  end
end
target = project.targets[targetIndex]
puts "2.找到 target : #{target}"
#添加bundle文件
files = target.resources_build_phase.files.to_a.map do |pbx_build_file|
    pbx_build_file.file_ref.real_path.to_s
end.select do |path|
  path.end_with?(".bundle")
end
bundleDic = Hash.new;
for key in files
    bundleDic[File.basename(key)] = 1;
end
Dir.foreach(path + "TheBull/bundles/") do |file|
    if file.include?("ios.bundle")
        if !bundleDic.has_key?(file)
            puts "3.添加 bundle文件 : #{file}"
            bundleFile = project.frameworks_group.new_file('TheBull/bundles/'+file)
            target.resources_build_phase.add_file_reference(bundleFile)
        else
            puts "3.已存在 bundle文件 : #{file}"
        end
    end
end
#修改配置
target.build_configurations.each do |config|
        puts "4.修改配置 #{config}"
        config.build_settings["PRODUCT_BUNDLE_IDENTIFIER"] = BundleId
        config.build_settings["DEVELOPMENT_TEAM"] = developmentTeam
        config.build_settings["PROVISIONING_PROFILE_SPECIFIER"] = provisioningProfile
        config.build_settings["MARKETING_VERSION"] = version
        config.build_settings["CURRENT_PROJECT_VERSION"] = buildVerison
end
puts "4.结束"
project.save
