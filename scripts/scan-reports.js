/**
 * 研报扫描脚本
 * 功能：自动扫描 reportlocal 目录下的研报文件，生成/更新 config/reports.js
 * 
 * 使用方法：node scripts/scan-reports.js
 */

const fs = require('fs');
const path = require('path');

// 配置
const REPORT_LOCAL_DIR = path.join(__dirname, '..', 'reportlocal');
const CONFIG_FILE = path.join(__dirname, '..', 'config', 'reports.js');

// 研报分类映射（文件夹名 -> 分类ID）
const CATEGORY_MAP = {
  '期遇粮机': {
    id: 'qiyuliaoji',
    label: '期遇粮机',
    author: '安粮期货研究所',
    filePrefix: '期遇粮机',
    titleTemplate: '期遇粮机|重点机会品种{date}'  // {date} 会替换为日期
  },
  '安粮观市': {
    id: 'anliangguanshi',
    label: '安粮观市',
    author: '安粮期货研究所',
    filePrefix: '安粮观市',
    titleTemplate: '安粮观市{date}'  // {date} 会替换为日期
  },
  '热点': {
    id: 'redian',
    label: '热点',
    author: '安粮期货研究所',
    filePrefix: '热点',
    isHotspot: true,  // 热点栏目使用特殊格式
    parseHotspotFileName: true
  },
  '周报': {
    id: 'zhoubao',
    label: '周报',
    author: '安粮期货研究所',
    filePrefix: '',
    isHotspot: true,  // 使用特殊格式解析
    parseHotspotFileName: true
  },
  '月报': {
    id: 'yuebao',
    label: '月报',
    author: '安粮期货研究所',
    filePrefix: '',
    isHotspot: true,  // 使用特殊格式解析
    parseHotspotFileName: true
  },
  '年报': {
    id: 'nianbao',
    label: '年报',
    author: '安粮期货研究所',
    filePrefix: '',
    isHotspot: true,  // 使用特殊格式解析
    parseHotspotFileName: true
  },
  '专题': {
    id: 'zhuanti',
    label: '专题',
    author: '安粮期货研究所',
    filePrefix: '',
    isHotspot: true,  // 使用特殊格式解析
    parseHotspotFileName: true
  },
  '期权': {
    id: 'qiquan',
    label: '期权',
    author: '安粮期货研究所',
    filePrefix: '',
    isHotspot: true,  // 使用特殊格式解析
    parseHotspotFileName: true
  }
};

// 支持的文件扩展名
const SUPPORTED_EXTENSIONS = ['.docx', '.doc', '.pdf', '.xlsx', '.xls'];

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(dateStr) {
  if (dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  }
  return dateStr;
}

/**
 * 解析热点栏目文件名
 * 格式：标题（作者：XXX-发布日期：YYYYMMDD-产业链：XXX-品种：XXX）.docx
 */
function parseHotspotFileName(fileName) {
  const result = {
    title: fileName,
    author: '',
    date: '',
    industry: '',
    varieties: []
  };

  // 提取作者（在括号内查找）
  const authorMatch = fileName.match(/[（(]作者[：:]([^）-]+)/);
  if (authorMatch) {
    result.author = authorMatch[1].trim();
  }

  // 提取发布日期（8位数字）
  const dateMatch = fileName.match(/发布日期[：:](\d{8})/);
  if (dateMatch) {
    result.date = formatDate(dateMatch[1]);
  }

  // 提取产业链（从"产业链："到"-品种"）
  const industryMatch = fileName.match(/产业链[：:]\s*([^)-]+?)\s*(?=-品种|$)/);
  if (industryMatch) {
    const industry = industryMatch[1].trim();
    // 过滤掉错误的产业链名
    if (industry && !industry.includes('品种')) {
      result.industry = industry;
    }
  }

  // 提取品种（可能有多个，用顿号或逗号分隔）
  const varietiesMatch = fileName.match(/品种[：:]\s*([^)）]+)/);
  if (varietiesMatch) {
    const varietiesStr = varietiesMatch[1].trim();
    // 按顿号、逗号、分号分隔
    result.varieties = varietiesStr.split(/[、，,]/).map(v => v.trim()).filter(v => v && v !== '）');
  }

  // 提取标题（括号前的内容）
  const titleMatch = fileName.match(/^([^（(]+)/);
  if (titleMatch) {
    result.title = titleMatch[1].trim();
  }

  return result;
}

/**
 * 扫描单个分类目录
 */
function scanCategoryDir(categoryName, categoryPath, categoryConfig) {
  const reports = [];

  // 读取年份目录
  if (!fs.existsSync(categoryPath)) {
    console.log(`  [跳过] 目录不存在: ${categoryPath}`);
    return reports;
  }

  const yearDirs = fs.readdirSync(categoryPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort((a, b) => b.localeCompare(a)); // 按年份降序

  // 热点栏目：如果没有年份目录，直接扫描根目录
  if (categoryConfig.isHotspot && yearDirs.length === 0) {
    const files = fs.readdirSync(categoryPath)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return SUPPORTED_EXTENSIONS.includes(ext);
      });

    for (const file of files) {
      const fileNameWithoutExt = path.basename(file, path.extname(file));
      const parsed = parseHotspotFileName(fileNameWithoutExt);
      
      const reportData = {
        id: `${categoryConfig.id}_${fileNameWithoutExt}`,
        category: categoryConfig.id,
        categoryLabel: categoryConfig.label,
        title: parsed.title,
        author: parsed.author || categoryConfig.author,
        date: parsed.date,
        pdfPath: `${categoryName}/${file}`,
        viewCount: 0,
        industry: parsed.industry,
        varieties: parsed.varieties
      };

      reports.push(reportData);
    }
    return reports;
  }

  for (const yearDir of yearDirs) {
    const yearPath = path.join(categoryPath, yearDir);

    // 读取文件
    const files = fs.readdirSync(yearPath)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return SUPPORTED_EXTENSIONS.includes(ext);
      })
      .filter(file => {
        if (categoryConfig.filePrefix) {
          return file.startsWith(categoryConfig.filePrefix);
        }
        return true;
      });

    for (const file of files) {
      // 提取文件名（不含扩展名）
      const fileNameWithoutExt = path.basename(file, path.extname(file));
      
      // 尝试从文件名提取日期（后8位，如：20260513）
      let dateStr = '';
      let potentialDate = '';
      
      if (fileNameWithoutExt.length >= 8) {
        potentialDate = fileNameWithoutExt.slice(-8);
        if (/^\d{8}$/.test(potentialDate)) {
          dateStr = formatDate(potentialDate);
        }
      }
      
      // 根据 titleTemplate 生成标题（{date} 替换为日期）
      let title = fileNameWithoutExt;
      let author = categoryConfig.author;
      let industry = '';
      let varieties = [];
      
      // 热点栏目使用特殊解析
      if (categoryConfig.isHotspot) {
        const parsed = parseHotspotFileName(fileNameWithoutExt);
        title = parsed.title;
        author = parsed.author || categoryConfig.author;
        industry = parsed.industry;
        varieties = parsed.varieties;
        if (parsed.date) {
          dateStr = parsed.date;
        }
      } else if (categoryConfig.titleTemplate && potentialDate) {
        title = categoryConfig.titleTemplate.replace('{date}', potentialDate);
      }
      
      // 如果没找到日期，使用文件修改时间
      if (!dateStr) {
        const stats = fs.statSync(path.join(yearPath, file));
        dateStr = stats.mtime.toISOString().split('T')[0];
      }

      const relativePath = `${categoryName}/${yearDir}/${file}`;

      const reportData = {
        id: `${categoryConfig.id}_${fileNameWithoutExt}`,
        category: categoryConfig.id,
        categoryLabel: categoryConfig.label,
        title: title || categoryConfig.label,
        author: author,
        date: dateStr,
        pdfPath: relativePath,
        viewCount: 0
      };

      // 热点栏目额外字段
      if (categoryConfig.isHotspot) {
        reportData.industry = industry;
        reportData.varieties = varieties;
      }

      reports.push(reportData);
    }
  }

  return reports;
}

/**
 * 扫描所有研报目录
 */
function scanAllReports() {
  const result = {};

  for (const [categoryName, categoryConfig] of Object.entries(CATEGORY_MAP)) {
    console.log(`\n扫描分类: ${categoryConfig.label}`);
    
    const categoryPath = path.join(REPORT_LOCAL_DIR, categoryName);
    const reports = scanCategoryDir(categoryName, categoryPath, categoryConfig);
    
    const key = `${categoryConfig.id.toUpperCase()}_REPORTS`;
    result[key] = reports;  // 始终添加（包括空数组）
    if (reports.length > 0) {
      console.log(`  找到 ${reports.length} 份研报`);
    } else {
      console.log(`  未找到研报文件`);
    }
  }

  return result;
}

/**
 * 生成配置文件内容
 */
function generateConfigContent(reports) {
  const lines = [];
  lines.push('/**');
  lines.push(' * 研报配置文件');
  lines.push(' * 由 scripts/scan-reports.js 自动生成');
  lines.push(` * 生成时间: ${new Date().toLocaleString('zh-CN')}`);
  lines.push(' */');
  lines.push('');
  lines.push('module.exports = {');

  const entries = Object.entries(reports);
  entries.forEach(([key, value], index) => {
    lines.push(`  ${key}: [`);
    
    value.forEach((report, i) => {
      const comma = i < value.length - 1 ? ',' : '';
      lines.push(`    {`);
      lines.push(`      id: '${report.id}',`);
      lines.push(`      category: '${report.category}',`);
      lines.push(`      categoryLabel: '${report.categoryLabel}',`);
      lines.push(`      title: '${report.title}',`);
      lines.push(`      author: '${report.author}',`);
      lines.push(`      date: '${report.date}',`);
      lines.push(`      pdfPath: '${report.pdfPath}',`);
      
      // 热点栏目额外字段
      if (report.industry) {
        lines.push(`      industry: '${report.industry}',`);
      }
      if (report.varieties && report.varieties.length > 0) {
        lines.push(`      varieties: ${JSON.stringify(report.varieties)},`);
      }
      
      lines.push(`    }${comma}`);
    });
    
    lines.push(`  ]${index < entries.length - 1 ? ',' : ''}`);
  });

  lines.push('};');
  
  return lines.join('\n');
}

/**
 * 主函数
 */
function main() {
  console.log('========================================');
  console.log('       研报扫描工具 v1.0');
  console.log('========================================');
  console.log(`\n研报目录: ${REPORT_LOCAL_DIR}`);
  console.log(`输出文件: ${CONFIG_FILE}`);

  // 确保目录存在
  const configDir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
    console.log(`\n已创建配置目录: ${configDir}`);
  }

  // 扫描研报
  console.log('\n开始扫描...');
  const reports = scanAllReports();

  // 统计
  let totalCount = 0;
  for (const [key, value] of Object.entries(reports)) {
    console.log(`\n${key}: ${value.length} 份研报`);
    totalCount += value.length;
  }

  console.log(`\n总计: ${totalCount} 份研报`);

  // 生成配置文件
  const configContent = generateConfigContent(reports);
  fs.writeFileSync(CONFIG_FILE, configContent, 'utf8');

  console.log(`\n✓ 配置文件已生成: ${CONFIG_FILE}`);
  console.log('\n========================================');
  console.log('       扫描完成！');
  console.log('========================================');
}

// 运行
main();
