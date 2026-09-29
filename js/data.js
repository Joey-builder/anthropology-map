/* ============================================================
   人类学思想史 — 内容数据
   ------------------------------------------------------------
   结构说明：
   · branches  领域（筛选药丸，颜色用于观点圆点）
   · periods   时期（筛选药丸）
   · starter   入门核心人物（“入门”筛选）
   · people    人物 → statements 观点
   每条观点 links 数组描述与其他观点的关系：
     {to:"观点id", type:"agree"|"disagree", note:"关系说明"}
   agree    = 继承 / 影响 / 同意
   disagree = 批评 / 分歧 / 论战
   ============================================================ */
window.ANTHRO_DATA = {

  meta: {
    title: "人类学思想史",
    latin: "HISTORY OF ANTHROPOLOGY",
    subtitle: "summarized & visualized · 观点、人物与争论的可视化地图",
    version: "work in progress v0.1",
    updated: "2026.09.29"
  },

  branches: [
    { id:"theory",      label:"理论与方法",     color:"#2e3192", desc:"学科范式、田野方法与理论转向" },
    { id:"kinship",     label:"亲属与社会",     color:"#c914b8", desc:"亲属制度、世系、婚姻与社会结构" },
    { id:"economic",    label:"经济与生态",     color:"#fbb03b", desc:"交换、生产、生态与物质生活" },
    { id:"political",   label:"政治与权力",     color:"#f04c23", desc:"政治秩序、权力、殖民与抵抗" },
    { id:"religion",    label:"宗教·仪式·象征", color:"#00aeac", desc:"宗教、巫术、仪式、象征与分类" },
    { id:"language",    label:"语言与认知",     color:"#3174e8", desc:"语言、沟通与思维的关系" },
    { id:"mind",        label:"心智·性别·身体", color:"#ffb6cd", desc:"文化与人格、性别、情感、身体与医疗" },
    { id:"archaeology", label:"考古与物质文化", color:"#9f4e2f", desc:"遗存、器物、物质文化与社会演化" },
    { id:"biological",  label:"生物人类学",     color:"#85d3e8", desc:"人类进化、遗传、种族与灵长类研究" },
    { id:"global",      label:"殖民·全球·当代", color:"#7e20d1", desc:"殖民遗产、全球化、现代性与当代议题" }
  ],

  periods: [
    { id:"pre",     label:"古典时期 · —1890" },
    { id:"found",   label:"奠基期 · 1890—1930" },
    { id:"struct",  label:"成熟与结构 · 1930—1960" },
    { id:"interp",  label:"解释与转向 · 1960—1985" },
    { id:"contemp", label:"当代 · 1985—" }
  ],

  starter: ["boas","malinowski","radcliffe-brown","durkheim","mauss","mead","benedict",
            "levy-strauss","evans-pritchard","geertz","turner","douglas","sahlins","wolf",
            "appadurai","fei"],

  people: [

    /* ---------------- 古典时期 ---------------- */
    {
      id:"bastian", name:"阿道夫·巴斯蒂安", en:"Adolf Bastian",
      born:1826, died:1905, country:"德国", period:"pre",
      branches:["theory","religion"], regions:["柏林","环球旅行"],
      tags:["民族学","基本思想","博物馆"],
      summary:"德国民族学与博物馆事业的奠基者。他主张人类心理的统一性，认为各民族文化是同一套“基本思想”在不同地理历史条件下的变体。",
      statements:[
        {id:"bastian-psychic", year:1860, branch:"theory", work:"《历史上的人》",
         text:"各民族共享同一套“基本思想”（Elementargedanken），差异来自地理与历史环境中的“民族思想”。",
         links:[]},
        {id:"bastian-museum", year:1873, branch:"theory", work:"柏林民族学博物馆",
         text:"博物馆应系统收藏各民族的物质文化，作为人类心理统一的实物证据。",
         links:[]}
      ]
    },
    {
      id:"tylor", name:"爱德华·伯内特·泰勒", en:"Edward Burnett Tylor",
      born:1832, died:1917, country:"英国", period:"pre",
      branches:["religion","theory"], regions:["墨西哥","英国"],
      tags:["古典进化论","文化定义","万物有灵论","遗存"],
      summary:"英国人类学的奠基人，给出了学科史上第一个系统性的“文化”定义，并以进化论框架比较宗教与习俗的起源。",
      statements:[
        {id:"tylor-culture", year:1871, branch:"theory", work:"《原始文化》",
         text:"文化是一个复合整体：知识、信仰、艺术、道德、法律、习俗，以及人作为社会成员所获得的一切能力与习惯。",
         links:[]},
        {id:"tylor-animism", year:1871, branch:"religion", work:"《原始文化》",
         text:"万物有灵论是宗教的起源；宗教沿着巫术—多神教—一神教的方向不断进化。",
         links:[{to:"frazer-goldengod", type:"agree", note:"弗雷泽接续了这条巫术—宗教—科学的进化阶梯。"}]},
        {id:"tylor-survivals", year:1871, branch:"religion", work:"《原始文化》",
         text:"“遗存”（survivals）是过去习俗的化石，可以据以重建文化的发展史。",
         links:[]}
      ]
    },
    {
      id:"morgan", name:"路易斯·亨利·摩尔根", en:"Lewis Henry Morgan",
      born:1818, died:1881, country:"美国", period:"pre",
      branches:["kinship","theory"], regions:["易洛魁联盟","北美"],
      tags:["古典进化论","亲属称谓","氏族"],
      summary:"美国人类学先驱。他以易洛魁人的田野记录和全球亲属称谓比较为基础，提出社会沿蒙昧—野蛮—文明三阶段进化的宏大框架。",
      statements:[
        {id:"morgan-stages", year:1877, branch:"theory", work:"《古代社会》",
         text:"人类社会沿蒙昧—野蛮—文明三阶段单线进化，技术发明与财产形式是主要标尺。",
         links:[{to:"tylor-culture", type:"agree", note:"与泰勒同属古典进化论阵营。"}]},
        {id:"morgan-kinterms", year:1871, branch:"kinship", work:"《人类家庭的血亲和姻亲制度》",
         text:"亲属称谓不是随意的命名，而是记录婚姻与家庭制度的“化石”。",
         links:[{to:"levy-strauss-alliance", type:"disagree", note:"列维-斯特劳斯抛弃阶段论，但接续并重建了亲属称谓的系统研究。"}]},
        {id:"morgan-iroquois", year:1851, branch:"kinship", work:"《易洛魁联盟》",
         text:"易洛魁人的氏族组织证明：社会结构可以被细致观察、记录并进行比较。",
         links:[{to:"lin-lolo", type:"agree", note:"与林耀华对凉山彝家的亲属与等级研究前后呼应。"}]}
      ]
    },
    {
      id:"frazer", name:"詹姆斯·乔治·弗雷泽", en:"James George Frazer",
      born:1854, died:1941, country:"英国", period:"pre",
      branches:["religion"], regions:["剑桥","意大利","全球比较材料"],
      tags:["比较宗教学","交感巫术","金枝"],
      summary:"以《金枝》闻名的比较宗教学者，用全球神话与民俗材料勾勒巫术、宗教到科学的“思想进化史”，是“扶手椅人类学”的集大成者。",
      statements:[
        {id:"frazer-goldengod", year:1890, branch:"religion", work:"《金枝》",
         text:"巫术、宗教与科学是思想进化的三个阶段；交感巫术基于相似与接触的联想原理。",
         links:[]},
        {id:"frazer-king", year:1890, branch:"religion", work:"《金枝》",
         text:"杀王与植物神神话共享同一模式：王权、丰产与周期性更新的普遍叙事。",
         links:[{to:"levy-strauss-myth", type:"disagree", note:"列维-斯特劳斯把同类材料从“进化阶段”改问为“结构变换”。"}]}
      ]
    },

    /* ---------------- 奠基期 ---------------- */
    {
      id:"boas", name:"弗朗茨·博厄斯", en:"Franz Boas",
      born:1858, died:1942, country:"美国（德裔）", period:"found",
      branches:["theory","language","biological"], regions:["北美西北海岸","夸扣特尔人"],
      tags:["文化相对主义","历史特殊论","四分支学科","反种族主义"],
      summary:"美国人类学的“父亲”。他反对单线进化与种族决定论，建立历史特殊论与长期田野传统，并奠定了体质、语言、考古、文化四分支的学科格局。",
      statements:[
        {id:"boas-relativism", year:1911, branch:"theory", work:"《原始人的心智》",
         text:"文化相对主义：各族群的行为与观念应在其自身历史脉络中理解，种族决定论在科学上不成立。",
         links:[
           {to:"bastian-psychic", type:"agree", note:"承接巴斯蒂安的心理统一论，但转向历史与经验的具体性。"},
           {to:"morgan-stages", type:"disagree", note:"反对单线进化与种族等级的文化序列。"}
         ]},
        {id:"boas-historism", year:1896, branch:"theory", work:"《人类学比较方法的局限》",
         text:"历史特殊论：文化差异来自特定的历史过程与传播，而非普遍进化规律。",
         links:[{to:"tylor-animism", type:"disagree", note:"拒绝把宗教与习俗塞进统一的进化阶段。"}]},
        {id:"boas-fieldwork", year:1920, branch:"theory", work:"《民族学方法》",
         text:"民族志必须基于当地语言与长期田野，反对二手材料拼贴出的比较研究。",
         links:[{to:"malinowski-method", type:"agree", note:"与英国功能主义同倡长期田野，但理论路径不同。"}]},
        {id:"boas-fourfields", year:1904, branch:"theory", work:"《人类学的历史》",
         text:"人类学应整合体质、语言、考古与文化研究，构成统一的四分支学科。",
         links:[]}
      ]
    },
    {
      id:"durkheim", name:"埃米尔·涂尔干", en:"Émile Durkheim",
      born:1858, died:1917, country:"法国", period:"found",
      branches:["religion","theory"], regions:["法国","澳大利亚"],
      tags:["社会事实","集体意识","神圣与凡俗"],
      summary:"社会学奠基人，也是人类学最重要的理论源头之一。他把社会事实当作“物”来研究，并以澳洲图腾制度说明宗教的社会本质。",
      statements:[
        {id:"durkheim-rules", year:1895, branch:"theory", work:"《社会学方法的准则》",
         text:"社会事实应被当作“物”来研究；社会先于个体，不可还原为个体心理。",
         links:[]},
        {id:"durkheim-elementary", year:1912, branch:"religion", work:"《宗教生活的基本形式》",
         text:"宗教的本质是社会：神圣与凡俗的二分，以及集体欢腾所生产的集体意识。",
         links:[]}
      ]
    },
    {
      id:"mauss", name:"马塞尔·莫斯", en:"Marcel Mauss",
      born:1872, died:1950, country:"法国", period:"found",
      branches:["economic","theory","religion"], regions:["法国","波利尼西亚材料"],
      tags:["礼物","互惠","总体社会事实","身体技术"],
      summary:"涂尔干的合作者与侄子，法国社会学派的核心人物。他的《礼物》奠定了交换与互惠研究的范式，至今仍是人类学被引用最多的文本之一。",
      statements:[
        {id:"mauss-gift", year:1925, branch:"economic", work:"《礼物》",
         text:"礼物不是商品：给予、接受、回礼三重义务构成一种“总体的社会事实”。",
         links:[
           {to:"durkheim-elementary", type:"agree", note:"在涂尔干的社会学纲领中研究交换与集体义务。"},
           {to:"malinowski-kula", type:"agree", note:"以库拉交换为关键材料，却反对纯功利的解释。"}
         ]},
        {id:"mauss-body", year:1934, branch:"mind", work:"《身体技术》",
         text:"身体技术是社会塑造的：走路、游泳、分娩的方式都经过文化的训练。",
         links:[{to:"bourdieu-habitus", type:"agree", note:"布迪厄的“习性”概念直接受益于身体技术。"}]},
        {id:"mauss-sacrifice", year:1899, branch:"religion", work:"《献祭的性质与功能》（与于贝尔合著）",
         text:"献祭是沟通神圣与凡俗的中介仪式，牺牲者的选择遵循社会逻辑。",
         links:[{to:"durkheim-rules", type:"agree", note:"法国社会学派宗教研究的纲领性成果。"}]}
      ]
    },
    {
      id:"malinowski", name:"布罗尼斯拉夫·马林诺夫斯基", en:"Bronisław Malinowski",
      born:1884, died:1942, country:"英国（波兰裔）", period:"found",
      branches:["theory","economic","religion"], regions:["特罗布里恩德群岛"],
      tags:["参与观察","功能主义","库拉圈"],
      summary:"现代田野方法的奠基者。他在特罗布里恩德群岛的长期居住研究，确立了参与观察与整体民族志的标准，并以“需要—功能”框架解释制度。",
      statements:[
        {id:"malinowski-method", year:1922, branch:"theory", work:"《西太平洋的航海者》",
         text:"民族志的目标是把握当地人的观点与其生活的整体，参与观察取代“扶手椅”比较法。",
         links:[{to:"frazer-goldengod", type:"disagree", note:"批评未经验证的比较材料无法解释实际生活。"}]},
        {id:"malinowski-functionalism", year:1922, branch:"theory", work:"《西太平洋的航海者》",
         text:"功能主义：制度存在的理由在于满足人的生物与社会需要。",
         links:[{to:"radcliffe-brown-structure", type:"disagree", note:"个体需要优先，还是社会结构优先？两派功能主义由此分道。"}]},
        {id:"malinowski-kula", year:1922, branch:"economic", work:"《西太平洋的航海者》",
         text:"库拉圈证明交换同时是经济的、仪式的与声望的，不能仅用功利理性解释。",
         links:[{to:"sahlins-affluent", type:"agree", note:"萨林斯据此提出“原初丰裕社会”。"}]},
        {id:"malinowski-crime", year:1926, branch:"political", work:"《原始社会的犯罪与习俗》",
         text:"法律不必依赖法庭：互惠义务与舆论本身构成无国家社会的约束力。",
         links:[]}
      ]
    },
    {
      id:"radcliffe-brown", name:"拉德克利夫-布朗", en:"A. R. Radcliffe-Brown",
      born:1881, died:1955, country:"英国", period:"found",
      branches:["theory","kinship","religion"], regions:["安达曼群岛","非洲"],
      tags:["结构功能主义","社会结构","世系理论"],
      summary:"英国结构功能主义领袖。他主张人类学应成为比较社会学，研究维持社会整体的关系网络，深刻影响了非洲世系研究与亲属理论。",
      statements:[
        {id:"radcliffe-brown-structure", year:1922, branch:"theory", work:"《安达曼岛人》",
         text:"社会结构是可观察的关系网络；社会学的任务是比较不同社会维持结构的形式。",
         links:[{to:"durkheim-elementary", type:"agree", note:"把涂尔干的社会学纲领改写成结构功能分析。"}]},
        {id:"radcliffe-brown-joking", year:1940, branch:"kinship", work:"《论戏谑关系》",
         text:"戏谑与回避关系是维持亲属结构中紧张与团结的调节机制。",
         links:[{to:"leach-burma", type:"disagree", note:"利奇指出结构并非稳定均衡，而是冲突与摇摆的过程。"}]},
        {id:"radcliffe-brown-function", year:1952, branch:"theory", work:"《原始社会的结构与功能》",
         text:"制度的功能在于维持社会整体的延续；对历史起源的推测无益于科学解释。",
         links:[]}
      ]
    },
    {
      id:"sapir", name:"爱德华·萨丕尔", en:"Edward Sapir",
      born:1884, died:1939, country:"美国", period:"found",
      branches:["language","mind"], regions:["北美印第安诸语言"],
      tags:["语言人类学","语言与文化","文化与个性"],
      summary:"博厄斯之后美国语言人类学的领袖，也是“文化与人格”研究的重要推动者。他主张语言是文化的符号系统，并最早系统论述语言与思维的关系。",
      statements:[
        {id:"sapir-language", year:1921, branch:"language", work:"《语言论》",
         text:"语言是文化的符号系统，语言学的分析方法可以推广到整个文化研究。",
         links:[]},
        {id:"sapir-culture", year:1924, branch:"mind", work:"《真实的文化与虚假的文化》",
         text:"真正的文化是个人与社会和谐互动的整体，而不是博物馆式的条目清单。",
         links:[{to:"benedict-patterns", type:"agree", note:"与本尼迪克特的文化型模研究同调。"}]}
      ]
    },
    {
      id:"mead", name:"玛格丽特·米德", en:"Margaret Mead",
      born:1901, died:1978, country:"美国", period:"found",
      branches:["mind","global"], regions:["萨摩亚","新几内亚"],
      tags:["文化与人格","性别气质","青春期"],
      summary:"最具公众影响力的美国人类学家。她以萨摩亚与新几内亚研究论证青春期与性别气质是文化塑造的结果，晚年成为公共知识分子的象征。",
      statements:[
        {id:"mead-samoa", year:1928, branch:"mind", work:"《萨摩亚人的成年》",
         text:"萨摩亚少女的青春期没有西方式的焦虑：青春期的紧张是文化造成的，而非生理必然。",
         links:[{to:"boas-relativism", type:"agree", note:"用跨文化比较检验并推广文化相对主义的命题。"}]},
        {id:"mead-gender", year:1935, branch:"mind", work:"《三个原始部落的性别与气质》",
         text:"性别气质是文化塑造的：三个新几内亚部落展示了多样的性别气质组合。",
         links:[]}
      ]
    },
    {
      id:"benedict", name:"鲁思·本尼迪克特", en:"Ruth Benedict",
      born:1887, died:1948, country:"美国", period:"found",
      branches:["mind","religion","global"], regions:["北美西南部","日本"],
      tags:["文化模式","日神型与酒神型","菊与刀"],
      summary:"博厄斯学派的代表人物，以“文化模式”概念把文化视为整合的价值整体。二战期间主持日本研究，写出影响深远的《菊与刀》。",
      statements:[
        {id:"benedict-patterns", year:1934, branch:"mind", work:"《文化模式》",
         text:"文化是一个整合的模式：个人的性格在文化模式中获得塑造与意义。",
         links:[{to:"boas-relativism", type:"agree", note:"把博厄斯的相对主义发展成文化整体论。"}]},
        {id:"benedict-apollonian", year:1934, branch:"mind", work:"《文化模式》",
         text:"日神型与酒神型：不同文化追求不同的价值极限，无法用单一进步尺度评判。",
         links:[{to:"morgan-stages", type:"disagree", note:"文化之间无高下，只有价值取向的差异。"}]},
        {id:"benedict-chrysanthemum", year:1946, branch:"global", work:"《菊与刀》",
         text:"远距研究：战争时期对日本的“远距离文化研究”证明文化与人格分析可用于理解敌国社会。",
         links:[{to:"mead-samoa", type:"agree", note:"同属文化与人格研究的方法谱系。"}]}
      ]
    },
    {
      id:"whorf", name:"本杰明·李·沃尔夫", en:"Benjamin Lee Whorf",
      born:1897, died:1941, country:"美国", period:"struct",
      branches:["language"], regions:["霍皮人","美国"],
      tags:["语言相对论","萨丕尔-沃尔夫假说"],
      summary:"萨丕尔的学生，语言相对论的代表。他比较霍皮语与印欧语的时间范畴，主张语法结构塑造习惯性的世界观。",
      statements:[
        {id:"whorf-relativity", year:1940, branch:"language", work:"《科学与语言学》",
         text:"语言相对论：语法范畴塑造习惯性的思维，霍皮语的时间经验不同于印欧语。",
         links:[{to:"sapir-culture", type:"agree", note:"把老师的语言文化观推向“语言塑造实在”。"}]},
        {id:"whorf-thought", year:1941, branch:"language", work:"《语言与逻辑》",
         text:"语言的分类方式即是经验的组织方式；比较语法就是比较世界观的路径。",
         links:[]}
      ]
    },

    /* ---------------- 成熟与结构 ---------------- */
    {
      id:"evans-pritchard", name:"埃文斯-普里查德", en:"E. E. Evans-Pritchard",
      born:1902, died:1973, country:"英国", period:"struct",
      branches:["religion","political","theory"], regions:["苏丹","阿赞德人","努尔人"],
      tags:["裂变制","巫术理性","历史转向"],
      summary:"英国社会人类学的典范人物。他证明“原始社会”的巫术与政治秩序自有其理性与逻辑，晚年又带头反思自然科学化的学科理想。",
      statements:[
        {id:"evans-pritchard-witchcraft", year:1937, branch:"religion", work:"《阿赞德人的巫术、神谕与魔法》",
         text:"阿赞德人的巫术是自洽的思维体系，不能以“原始思维”贬斥为迷信。",
         links:[{to:"tylor-animism", type:"disagree", note:"巫术不是进化遗存，而是日常生活中的理性说明制度。"}]},
        {id:"evans-pritchard-nuer", year:1940, branch:"political", work:"《努尔人》",
         text:"无国家社会同样拥有秩序：裂变制通过不断变动的对立关系维持政治平衡。",
         links:[{to:"radcliffe-brown-structure", type:"agree", note:"结构功能分析在非洲政治研究中的经典运用。"}]},
        {id:"evans-pritchard-history", year:1950, branch:"theory", work:"《社会人类学》（马雷特讲演）",
         text:"社会人类学应像历史学一样研究具体社会，而不是追求自然科学的普遍法则。",
         links:[{to:"radcliffe-brown-function", type:"disagree", note:"从“自然科学”理想退回解释与历史取向。"}]}
      ]
    },
    {
      id:"firth", name:"雷蒙德·弗斯", en:"Raymond Firth",
      born:1901, died:2002, country:"英国", period:"struct",
      branches:["economic","theory"], regions:["蒂科皮亚岛"],
      tags:["经济人类学","社会过程","实质论"],
      summary:"马林诺夫斯基的继任者与批评性继承者。他以蒂科皮亚岛的长期研究说明社会结构在具体互动中不断被再生产，并开创经济人类学。",
      statements:[
        {id:"firth-process", year:1936, branch:"theory", work:"《我们，蒂科皮亚人》",
         text:"社会结构在具体互动与选择中被不断再生产，结构与过程不可分割。",
         links:[{to:"radcliffe-brown-structure", type:"agree", note:"把“结构”从静态框架改造为动态过程。"}]},
        {id:"firth-economy", year:1939, branch:"economic", work:"《原始波利尼西亚经济》",
         text:"经济人类学不能预设“经济人”：原始经济嵌在亲属与仪式的义务网络之中。",
         links:[{to:"sahlins-affluent", type:"agree", note:"实质论取向的先声。"}]}
      ]
    },
    {
      id:"fortes", name:"迈耶·福特斯", en:"Meyer Fortes",
      born:1906, died:1983, country:"英国", period:"struct",
      branches:["kinship","political"], regions:["加纳","塔伦西人"],
      tags:["世系理论","非洲政治体系"],
      summary:"与埃文斯-普里查德共同主编《非洲政治体系》，以塔伦西人的世系研究确立“世系理论”的典范，展示亲属结构如何承载政治与宗教功能。",
      statements:[
        {id:"fortes-politics", year:1940, branch:"political", work:"《非洲政治体系》（与埃文斯-普里查德合编）",
         text:"没有中央权力与法庭的社会，依然拥有可分析的政治秩序与制裁机制。",
         links:[{to:"evans-pritchard-nuer", type:"agree", note:"把无国家社会的政治秩序确立为比较研究的对象。"}]},
        {id:"fortes-tallensi", year:1949, branch:"kinship", work:"《塔伦西人的亲属网络》",
         text:"世系结构是塔伦西人政治与宗教生活的基本框架：亲属关系即社会秩序。",
         links:[{to:"radcliffe-brown-structure", type:"agree", note:"世系理论的结构功能主义典范案例。"}]}
      ]
    },
    {
      id:"bateson", name:"格雷戈里·贝特森", en:"Gregory Bateson",
      born:1904, died:1980, country:"英国", period:"struct",
      branches:["mind","language"], regions:["新几内亚","巴厘岛"],
      tags:["分裂生成","沟通理论","控制论"],
      summary:"跨越人类学、精神病学与控制论的思想家。他研究文化接触中的行为放大机制，并与米德合作拍摄巴厘岛的文化行为。",
      statements:[
        {id:"bateson-schismogenesis", year:1936, branch:"mind", work:"《纳文》",
         text:"“分裂生成”：文化接触中的行为会相互放大，仪式性的性别反转用于平衡这种螺旋。",
         links:[{to:"gluckman-rebellion", type:"agree", note:"对冲突与过程的共同关注。"}]},
        {id:"bateson-bali", year:1942, branch:"mind", work:"《巴厘岛人的性格》（与米德合著）",
         text:"用摄影与影像系统记录文化行为，探索“文化与人格”的经验研究方式。",
         links:[{to:"mead-samoa", type:"agree", note:"与米德共同推进文化与人格研究。"}]},
        {id:"bateson-mind", year:1972, branch:"language", work:"《走向心灵生态学》",
         text:"信息与关系模式（元沟通、双重束缚）比内容更根本，人类学应研究沟通系统。",
         links:[{to:"sapir-culture", type:"agree", note:"语言—沟通取向的延伸。"}]}
      ]
    },
    {
      id:"levy-strauss", name:"克洛德·列维-斯特劳斯", en:"Claude Lévi-Strauss",
      born:1908, died:2009, country:"法国", period:"struct",
      branches:["theory","kinship","religion","mind"], regions:["巴西","亚马逊"],
      tags:["结构主义","联盟理论","野性思维","神话学"],
      summary:"结构主义人类学的创立者。他把亲属、神话与分类系统视为心智无意识结构的变换，其影响远远超出人类学，波及整个人文社会科学。",
      statements:[
        {id:"levy-strauss-alliance", year:1949, branch:"kinship", work:"《亲属制度的基本结构》",
         text:"亲属制度是交换系统：乱伦禁忌迫使群体通过婚姻交换建立联盟。",
         links:[{to:"mauss-gift", type:"agree", note:"把礼物交换理论改写为婚姻联盟的结构理论。"}]},
        {id:"levy-strauss-tristes", year:1955, branch:"theory", work:"《忧郁的热带》",
         text:"民族志书写本身是“西方与它者”关系的一部分：旅行、观察与写作都需要自省。",
         links:[]},
        {id:"levy-strauss-savage", year:1962, branch:"theory", work:"《野性思维》",
         text:"具体性思维与科学思维并行；“拼贴匠”用手边的符号材料组装出意义秩序。",
         links:[{to:"geertz-interpretation", type:"disagree", note:"解释取向与结构取向之争：意义之网 vs 无意识结构。"}]},
        {id:"levy-strauss-myth", year:1964, branch:"religion", work:"《神话学：生食与熟食》",
         text:"神话的意义来自神话素之间的对立与变换规则，而非叙事内容本身。",
         links:[{to:"turner-symbols", type:"disagree", note:"特纳强调象征的过程与经验，反对静态的结构演绎。"}]},
        {id:"levy-strauss-race", year:1952, branch:"global", work:"《种族与历史》",
         text:"文化多样性不应被单线进化排序；“进步”是站在西方视角上的错觉。",
         links:[{to:"montagu-myth", type:"agree", note:"战后反种族主义的科学宣言之一。"}]}
      ]
    },
    {
      id:"leach", name:"埃德蒙·利奇", en:"Edmund Leach",
      born:1910, died:1989, country:"英国", period:"struct",
      branches:["political","theory"], regions:["缅甸克钦","斯里兰卡"],
      tags:["政治人类学","过程分析","结构批判"],
      summary:"结构功能主义最有力的内部批评者。他以缅甸克钦人的研究说明社会秩序在两种理想型之间摇摆，结构不是稳定均衡而是历史过程。",
      statements:[
        {id:"leach-burma", year:1954, branch:"political", work:"《缅甸高地的政治制度》",
         text:"克钦社会在贡萨与贡劳两种秩序之间摆动：均衡是过程，不是稳定结构。",
         links:[{to:"radcliffe-brown-joking", type:"disagree", note:"反对把结构设想为自我平衡的稳定系统。"}]},
        {id:"leach-rethink", year:1961, branch:"theory", work:"《重新思考人类学》",
         text:"人类学概念是断裂的：婚姻、亲属等范畴在跨文化转译中必须重新定义。",
         links:[{to:"levy-strauss-myth", type:"agree", note:"接受结构分析，但要求加入历史与过程。"}]}
      ]
    },
    {
      id:"gluckman", name:"马克斯·格拉克曼", en:"Max Gluckman",
      born:1911, died:1975, country:"英国（南非出生）", period:"struct",
      branches:["political","religion"], regions:["南非","赞比亚","罗齐人"],
      tags:["曼彻斯特学派","反叛仪式","法律过程"],
      summary:"曼彻斯特学派的创始人。他强调冲突是社会的常态，仪式与法律把冲突纳入可控秩序，由此开启过程取向的政治人类学。",
      statements:[
        {id:"gluckman-rebellion", year:1954, branch:"religion", work:"《东南非洲的反叛仪式》",
         text:"反叛仪式：仪式性地表达对权力的不满，反而强化了既有秩序。",
         links:[{to:"radcliffe-brown-function", type:"disagree", note:"以冲突视角修正均衡功能主义。"}]},
        {id:"gluckman-judicial", year:1955, branch:"political", work:"《巴罗策人的司法过程》",
         text:"法律是社会冲突的常规化处理过程，而不是一套静态的规范条文。",
         links:[{to:"malinowski-crime", type:"agree", note:"把互惠与制裁问题推进到法庭过程研究。"}]}
      ]
    },
    {
      id:"turner", name:"维克多·特纳", en:"Victor Turner",
      born:1920, died:1983, country:"英国 / 美国", period:"interp",
      branches:["religion"], regions:["赞比亚","恩丹布人"],
      tags:["象征人类学","阈限","交融","社会戏剧"],
      summary:"仪式研究的集大成者。他用“社会戏剧”“阈限”“交融”等概念，把仪式理解为社会冲突与更新的过程，而非静态的象征体系。",
      statements:[
        {id:"turner-ritual", year:1957, branch:"religion", work:"《一个非洲社会的分裂与延续》",
         text:"社会戏剧：冲突、危机、补救、重组构成社会过程的基本结构。",
         links:[{to:"gluckman-rebellion", type:"agree", note:"曼彻斯特学派的冲突—过程传统。"}]},
        {id:"turner-symbols", year:1967, branch:"religion", work:"《象征的森林》",
         text:"象征是多义的：每个象征浓缩多重意义，同时作用于情感与规范。",
         links:[{to:"geertz-deep", type:"agree", note:"与格尔茨的象征—意义分析并肩而立。"}]},
        {id:"turner-communitas", year:1969, branch:"religion", work:"《仪式过程》",
         text:"阈限与交融：仪式的过渡阶段产生短暂的平等共同体（communitas），反照结构本身。",
         links:[{to:"durkheim-elementary", type:"agree", note:"“集体欢腾”的仪式过程版本。"}]}
      ]
    },
    {
      id:"douglas", name:"玛丽·道格拉斯", en:"Mary Douglas",
      born:1921, died:2007, country:"英国", period:"interp",
      branches:["religion","theory"], regions:["刚果","伦敦"],
      tags:["洁净与危险","分类","格群分析"],
      summary:"象征人类学与分类研究的代表。她提出“污秽即错位之物”，把禁忌解释为分类系统的越界，并以“群体/网格”框架分析社会结构与象征形式的关系。",
      statements:[
        {id:"douglas-purity", year:1966, branch:"religion", work:"《洁净与危险》",
         text:"污秽不是物质的不洁，而是分类的越界——“错位之物”（matter out of place）。",
         links:[{to:"turner-communitas", type:"agree", note:"把阈限与分类的洞见推进到污染与禁忌研究。"}]},
        {id:"douglas-grid", year:1970, branch:"theory", work:"《自然的象征》",
         text:"群体与网格：社会结构的两个维度可以预测仪式与象征的形态。",
         links:[
           {to:"durkheim-elementary", type:"agree", note:"社会形态与分类形式相关联。"},
           {to:"levy-strauss-savage", type:"agree", note:"把结构分类分析用于日常与仪式生活。"}
         ]}
      ]
    },
    {
      id:"geertz", name:"克利福德·格尔茨", en:"Clifford Geertz",
      born:1926, died:2006, country:"美国", period:"interp",
      branches:["theory","religion","economic"], regions:["爪哇","巴厘岛","摩洛哥"],
      tags:["深描","解释人类学","剧场国家","内卷化"],
      summary:"解释人类学的旗手。他把文化定义为“意义之网”，以“深描”确立民族志的写作标准，对整个人文社科界影响巨大。",
      statements:[
        {id:"geertz-interpretation", year:1973, branch:"theory", work:"《文化的解释》",
         text:"深描：民族志的任务是记录意义的层级结构，而不是提炼行为规律。",
         links:[{to:"malinowski-method", type:"disagree", note:"参与观察之外仍需解释：从“在那里”到“写下它”。"}]},
        {id:"geertz-deep", year:1973, branch:"religion", work:"《深层游戏：巴厘岛的斗鸡》",
         text:"巴厘斗鸡是一段文本：文化通过公共象征展示地位焦虑与声望竞争。",
         links:[]},
        {id:"geertz-involution", year:1963, branch:"economic", work:"《农业内卷化》",
         text:"内卷化：爪哇农业以劳动力填充换来增长，却没有发展。",
         links:[]},
        {id:"geertz-religion", year:1973, branch:"religion", work:"《作为文化系统的宗教》",
         text:"宗教是文化系统：它通过象征在情绪与动机之间建立秩序。",
         links:[{to:"asad-genealogy", type:"disagree", note:"阿萨德批评：把宗教定义为象征系统，忽视了权力与历史。"}]},
        {id:"geertz-negara", year:1980, branch:"political", work:"《尼加拉：十九世纪巴厘剧场国家》",
         text:"剧场国家：仪式不是权力的装饰，而是权力本身；政治以表演实现秩序。",
         links:[{to:"wolf-history", type:"disagree", note:"政治经济学视角补充：仪式国家同样被卷入贸易与殖民体系。"}]}
      ]
    },
    {
      id:"dumont", name:"路易·杜蒙", en:"Louis Dumont",
      born:1911, died:1998, country:"法国", period:"interp",
      branches:["kinship","political","religion"], regions:["南印度","法国"],
      tags:["种姓制度","等级","整体主义与个人主义"],
      summary:"印度研究大家。他以洁净/污染的等级整体解释种姓制度，并指出“个人主义”是西方特有的意识形态，必须被人类学对象化。",
      statements:[
        {id:"dumont-homo", year:1966, branch:"kinship", work:"《阶序人》",
         text:"种姓制度以洁净/污染的等级整合社会，必须作为一个等级整体来理解。",
         links:[{to:"levy-strauss-alliance", type:"agree", note:"把结构方法用于等级整体的分析。"}]},
        {id:"dumont-ideology", year:1966, branch:"political", work:"《阶序人》",
         text:"现代意识形态把个人当作价值的终极承载者；人类学必须反思这一本土范畴。",
         links:[]}
      ]
    },

    /* ---------------- 解释与转向 ---------------- */
    {
      id:"sahlins", name:"马歇尔·萨林斯", en:"Marshall Sahlins",
      born:1930, died:2021, country:"美国", period:"interp",
      branches:["economic","theory","global"], regions:["太平洋","夏威夷"],
      tags:["原初丰裕社会","结构—历史","文化与实践理性"],
      summary:"最具想象力的人类学家之一。他先后提出“原初丰裕社会”、批判功利理性的“文化与实践理性”，并以库克船长事件讨论结构与历史的关系。",
      statements:[
        {id:"sahlins-affluent", year:1972, branch:"economic", work:"《石器时代经济学》",
         text:"原初丰裕社会：狩猎采集者需求有限、手段充足，稀缺是被制造的假设。",
         links:[]},
        {id:"sahlins-practical-reason", year:1976, branch:"theory", work:"《文化与实践理性》",
         text:"文化与实践理性：人的需要与利益由文化范畴中介，功利解释无法穷尽社会再生产。",
         links:[{to:"harris-materialism", type:"disagree", note:"文化范畴 vs 生态—功利因果，两种解释纲领的对峙。"}]},
        {id:"sahlins-islands", year:1985, branch:"global", work:"《历史之岛》",
         text:"结构与历史：夏威夷人把库克船长的到来纳入神话图式，事件以文化结构的方式被理解。",
         links:[
           {to:"wolf-history", type:"agree", note:"把全球遭遇纳入文化与结构的分析。"},
           {to:"levy-strauss-myth", type:"agree", note:"把静态的结构概念动态化、历史化。"}
         ]}
      ]
    },
    {
      id:"wolf", name:"埃里克·沃尔夫", en:"Eric Wolf",
      born:1923, died:1999, country:"美国（奥地利裔）", period:"interp",
      branches:["political","global","economic"], regions:["墨西哥","欧洲","全球"],
      tags:["政治经济学","世界体系","农民研究"],
      summary:"把人类学带进世界体系历史的学者。他反对把社区当作孤岛，主张从权力、资本与殖民过程理解文化，影响了几代政治经济取向的研究。",
      statements:[
        {id:"wolf-community", year:1964, branch:"theory", work:"《人类学》",
         text:"人类学不应把社区当作孤立单元，而要放进资本主义世界体系的历史之中。",
         links:[{to:"boas-historism", type:"disagree", note:"文化史路径未能说明外部权力与体系。"}]},
        {id:"wolf-history", year:1982, branch:"global", work:"《欧洲与没有历史的人民》",
         text:"“没有历史的人民”并非没有历史，而是被资本主义扩张卷入并重写。",
         links:[]},
        {id:"wolf-power", year:1982, branch:"political", work:"《欧洲与没有历史的人民》",
         text:"文化是权力关系中的建构与斗争，而不是和谐统一的整体。",
         links:[{to:"asad-encounter", type:"agree", note:"与人类学殖民权力反思同调。"}]}
      ]
    },
    {
      id:"mintz", name:"西敏司", en:"Sidney Mintz",
      born:1922, died:2015, country:"美国", period:"interp",
      branches:["economic","global"], regions:["加勒比","波多黎各"],
      tags:["糖的政治经济","商品","工人阶级"],
      summary:"以糖为线索书写殖民资本主义史的学者。他证明一种日常调味品如何串联种植园、奴隶贸易、工业无产阶级与帝国的消费政治。",
      statements:[
        {id:"mintz-worker", year:1960, branch:"economic", work:"《甘蔗工人》",
         text:"单一生命史与糖业社区：阶级、家庭与劳动力必须放进历史过程来理解。",
         links:[{to:"wolf-community", type:"agree", note:"把社区研究与政治经济史结合。"}]},
        {id:"mintz-sugar", year:1985, branch:"economic", work:"《甜与权力》",
         text:"糖的历史显示殖民贸易如何塑造日常消费与意义：甜味是权力的味道。",
         links:[{to:"wolf-history", type:"agree", note:"政治经济与文化的交汇研究。"}]},
        {id:"mintz-commodity", year:1985, branch:"global", work:"《甜与权力》",
         text:"商品在成为日用品之前的漫长旅程，是政治经济与意义生产的交汇点。",
         links:[{to:"appadurai-things", type:"agree", note:"与“物的社会生命”研究相互呼应。"}]}
      ]
    },
    {
      id:"harris", name:"马文·哈里斯", en:"Marvin Harris",
      born:1927, died:2001, country:"美国", period:"interp",
      branches:["theory","economic","religion"], regions:["巴西","印度","莫桑比克"],
      tags:["文化唯物主义","生态理性","印度圣牛"],
      summary:"文化唯物主义的创立者。他坚持用技术—环境—生产的条件解释文化差异，以“印度圣牛”等案例挑战象征与解释取向。",
      statements:[
        {id:"harris-theory", year:1968, branch:"theory", work:"《人类学理论的兴起》",
         text:"人类学理论史是科学与人本两种传统的拉锯；文化唯物主义站在科学一边。",
         links:[{to:"boas-historism", type:"disagree", note:"批评历史特殊论只描述而不作因果解释。"}]},
        {id:"harris-materialism", year:1979, branch:"theory", work:"《文化唯物主义》",
         text:"技术—环境—生产的条件（基础设施）塑造社会结构与观念（上层建筑）。",
         links:[]},
        {id:"harris-cows", year:1974, branch:"religion", work:"《牛、猪、战争与女巫》",
         text:"印度牛的神圣性有其生态—经济理性：保护役畜是长期的生存策略。",
         links:[{to:"douglas-purity", type:"disagree", note:"禁忌是分类逻辑还是生态理性？象征解释与功能解释的冲突。"}]}
      ]
    },
    {
      id:"schneider", name:"大卫·施奈德", en:"David M. Schneider",
      born:1918, died:1995, country:"美国", period:"interp",
      branches:["kinship"], regions:["芝加哥","美国"],
      tags:["亲属研究批判","文化象征系统"],
      summary:"以摧毁自身研究领域而闻名的学者。他指出亲属研究建立在西方“血缘即生物事实”的假设上，最终宣告传统亲属研究的终结。",
      statements:[
        {id:"schneider-american", year:1968, branch:"kinship", work:"《美国亲属：一种文化说明》",
         text:"美国的亲属是一套文化象征系统：血缘、婚姻与规范意义都由文化定义。",
         links:[{to:"radcliffe-brown-structure", type:"disagree", note:"动摇世系理论把生物谱系当作社会事实的假设。"}]},
        {id:"schneider-critique", year:1984, branch:"kinship", work:"《对亲属研究的批判》",
         text:"“亲属”是西方的本土范畴；将它投射到其他社会，必须接受彻底批判。",
         links:[{to:"levy-strauss-alliance", type:"disagree", note:"联盟理论与世系理论共享了生物基础的假设。"}]}
      ]
    },
    {
      id:"bourdieu", name:"皮埃尔·布迪厄", en:"Pierre Bourdieu",
      born:1930, died:2002, country:"法国", period:"interp",
      branches:["theory"], regions:["阿尔及利亚","法国"],
      tags:["实践理论","习性","文化再生产"],
      summary:"从卡比尔人的田野研究走向社会实践理论的大家。他以“习性”“资本”“场域”解释实践如何既被结构塑造又不断生成结构。",
      statements:[
        {id:"bourdieu-habitus", year:1972, branch:"theory", work:"《实践理论大纲》",
         text:"实践理论：习性是被结构化的生成原则，行动既不是规则遵循，也不是功利计算。",
         links:[{to:"levy-strauss-savage", type:"disagree", note:"反对把实践还原为无意识结构或规则系统。"}]},
        {id:"bourdieu-distinction", year:1979, branch:"theory", work:"《区分》",
         text:"趣味即阶级标记：文化消费的差异再生产着社会区隔。",
         links:[]}
      ]
    }
,
    {
      id:"rubin", name:"盖尔·鲁宾", en:"Gayle Rubin",
      born:1949, died:null, country:"美国", period:"interp",
      branches:["mind","theory"], regions:["美国"],
      tags:["性/性别制度","性别政治","酷儿理论"],
      summary:"性别研究的关键理论家。她以人类学的交换理论重构“性/性别制度”的概念，并在此后把批判扩展到性规范的权力生产。",
      statements:[
        {id:"rubin-traffic", year:1975, branch:"mind", work:"《女人交易》",
         text:"性/性别制度：用交换与再生产理论分析女性如何被制度性地安排。",
         links:[{to:"levy-strauss-alliance", type:"agree", note:"借用婚姻交换理论，同时从女性主义立场加以批判。"}]},
        {id:"rubin-sex", year:1984, branch:"mind", work:"《思考性》",
         text:"性的政治：性规范不断生产“正常”与“越界”，需要独立的批判框架。",
         links:[]}
      ]
    },
    {
      id:"ortner", name:"谢里·奥特纳", en:"Sherry Ortner",
      born:1941, died:null, country:"美国", period:"interp",
      branches:["mind","theory"], regions:["尼泊尔","夏威夷"],
      tags:["女性主义人类学","实践论","自然/文化"],
      summary:"女性主义人类学与实践论转向的代表人物。她既追问“女性为何普遍被贬值”，也系统总结了六十年代以来人类学从结构走向能动性的理论变迁。",
      statements:[
        {id:"ortner-nature", year:1974, branch:"mind", work:"《女性之于男性是否如同自然之于文化？》",
         text:"女性被置于“自然”一侧而男性被置于“文化”一侧，这是文化建构的象征秩序，而非天性。",
         links:[{to:"mead-gender", type:"agree", note:"性别气质的文化建构这一命题的延续与深化。"}]},
        {id:"ortner-practice", year:1984, branch:"theory", work:"《六十年代以来的人类学理论》",
         text:"实践论转向：人类学从结构转向能动性、历史与权力。",
         links:[{to:"bourdieu-habitus", type:"agree", note:"实践理论的美国式综合与传播。"}]}
      ]
    },
    {
      id:"rosaldo-m", name:"米歇尔·罗萨尔多", en:"Michelle Z. Rosaldo",
      born:1944, died:1981, country:"美国", period:"interp",
      branches:["mind","political"], regions:["菲律宾","伊隆戈人"],
      tags:["情感人类学","女性主义","猎头"],
      summary:"情感人类学的先行者。她研究伊隆戈人的猎头与情感如何连接自我与政治，并反思女性主义人类学自身的分析范畴。",
      statements:[
        {id:"rosaldo-passion", year:1980, branch:"mind", work:"《知识与激情》",
         text:"伊隆戈人的猎头与情感：愤怒与知识通过情感话语把自我与社会连在一起。",
         links:[{to:"geertz-deep", type:"agree", note:"把意义分析推进到情感与身体经验。"}]},
        {id:"rosaldo-feminism", year:1980, branch:"political", work:"《人类学的用途与滥用》",
         text:"女性主义人类学必须反思学科自身的分析范畴，而不是套用普遍化的性别模型。",
         links:[{to:"rubin-traffic", type:"agree", note:"性别范畴的批判性重构。"}]}
      ]
    },
    {
      id:"taussig", name:"迈克尔·陶西格", en:"Michael Taussig",
      born:1940, died:null, country:"澳大利亚 / 美国", period:"interp",
      branches:["economic","theory"], regions:["哥伦比亚","南美"],
      tags:["商品拜物教","魔鬼","模仿"],
      summary:"以诗性与实验文风著称的人类学家。他研究矿区农民如何用魔鬼信仰理解资本主义交换的暴力，并把“模仿”发展为权力分析的概念。",
      statements:[
        {id:"taussig-devil", year:1980, branch:"economic", work:"《魔鬼与商品拜物教》",
         text:"矿区农民的魔鬼信仰，是对资本主义交换之暴力的一种寓意式解释。",
         links:[{to:"mintz-sugar", type:"agree", note:"政治经济与意义分析的结合。"}]},
        {id:"taussig-mimesis", year:1993, branch:"theory", work:"《模仿与他者》",
         text:"模仿：模仿他者是身体与权力的政治，殖民恐惧透过复制与变形流通。",
         links:[]}
      ]
    },
    {
      id:"fabian", name:"约翰内斯·法比安", en:"Johannes Fabian",
      born:1937, died:2016, country:"德国 / 美国", period:"contemp",
      branches:["theory","global"], regions:["刚果","荷兰"],
      tags:["同代性","时间政治","反思人类学"],
      summary:"以《时间与他者》质疑人类学的认识论前提：把研究对象安放在“过去”，正是殖民权力的时间政治。",
      statements:[
        {id:"fabian-time", year:1983, branch:"theory", work:"《时间与他者》",
         text:"同代性：人类学写作把研究对象置于“过去”，这种时间距离是殖民权力的认识论形式。",
         links:[{to:"asad-encounter", type:"agree", note:"与殖民权力反思一道，重审学科的知识形式。"}]}
      ]
    },
    {
      id:"asad", name:"塔拉勒·阿萨德", en:"Talal Asad",
      born:1932, died:null, country:"英国 / 美国", period:"contemp",
      branches:["global","religion","theory"], regions:["中东","苏丹"],
      tags:["殖民遭遇","宗教谱系","权力"],
      summary:"反思人类学与宗教研究的关键人物。他追问人类学知识生产的殖民条件，并批判把“宗教”当作普适范畴的定义方式。",
      statements:[
        {id:"asad-encounter", year:1973, branch:"global", work:"《人类学与殖民遭遇》",
         text:"人类学与殖民遭遇：学科的知识生产嵌入殖民权力关系，必须反思其政治条件。",
         links:[{to:"radcliffe-brown-function", type:"disagree", note:"“纯科学”的姿态掩盖了殖民处境。"}]},
        {id:"asad-genealogy", year:1993, branch:"religion", work:"《宗教的谱系》",
         text:"“宗教”是近代西方的范畴；将它普适化会遮蔽具体历史与权力关系。",
         links:[]}
      ]
    },
    {
      id:"clifford", name:"詹姆斯·克利福德", en:"James Clifford",
      born:1945, died:null, country:"美国", period:"contemp",
      branches:["theory","global"], regions:["美国","博物馆"],
      tags:["写文化","民族志权威","实验民族志"],
      summary:"反思民族志写作的代表人物。他与马尔库斯共同主编《写文化》，把民族志视为带有诗学与政治维度的写作实践。",
      statements:[
        {id:"clifford-authority", year:1983, branch:"theory", work:"《论民族志权威》",
         text:"民族志写作是诗学与政治：权威、修辞与叙事策略共同构造“我在此处”的证明。",
         links:[{to:"levy-strauss-tristes", type:"agree", note:"《忧郁的热带》被视为自反性写作的先声。"}]},
        {id:"clifford-predicament", year:1988, branch:"global", work:"《文化的困境》",
         text:"文化是挪用的技艺：民族志对象在收藏、展览与挪用中被不断重新定义。",
         links:[{to:"appadurai-things", type:"agree", note:"与“物的社会生命”研究在博物馆政治上相互呼应。"}]}
      ]
    },
    {
      id:"marcus", name:"乔治·马尔库斯", en:"George E. Marcus",
      born:1946, died:null, country:"美国", period:"contemp",
      branches:["theory","global"], regions:["美国","汤加"],
      tags:["写文化","多地点民族志","自反性"],
      summary:"与克利福德共同推动“写文化”转向，并在此后提出多地点民族志，回应研究对象本身的世界体系分布。",
      statements:[
        {id:"marcus-multisited", year:1995, branch:"theory", work:"《世界体系中的民族志》",
         text:"多地点民族志：在多个场所之间追踪对象，才能呈现世界体系中的文化过程。",
         links:[{to:"clifford-authority", type:"agree", note:"实验民族志方法论的延伸。"}]},
        {id:"marcus-authority", year:1986, branch:"theory", work:"《写文化》（与克利福德合编）",
         text:"民族志权威本身就是争议场：再现他者要求新的自反性写作伦理。",
         links:[{to:"abu-writing", type:"agree", note:"与“书写反文化”的批判互为呼应。"}]}
      ]
    },
    {
      id:"appadurai", name:"阿尔君·阿帕杜莱", en:"Arjun Appadurai",
      born:1949, died:null, country:"印度 / 美国", period:"contemp",
      branches:["global","economic"], regions:["印度","美国"],
      tags:["物的社会生命","全球化","景观"],
      summary:"全球化人类学最重要的理论家。他提出“物的社会生命”与全球文化流动的“景观”框架，重塑了我们对地方与全球关系的理解。",
      statements:[
        {id:"appadurai-things", year:1986, branch:"economic", work:"《物的社会生命》（主编）",
         text:"物品有社会生命：从礼物到商品的位置移动，揭示政治与意义的变迁。",
         links:[{to:"mauss-gift", type:"agree", note:"把礼物研究推进到“物的社会生命”与商品化问题。"}]},
        {id:"appadurai-global", year:1996, branch:"global", work:"《消散的现代性》",
         text:"全球化的五个景观（族裔、媒介、技术、金融、意识形态）重写了地方性的生产。",
         links:[{to:"wolf-history", type:"agree", note:"为全球体系研究加上文化的维度。"}]},
        {id:"appadurai-imagined", year:1996, branch:"global", work:"《消散的现代性》",
         text:"媒介与迁移创造了新的想象与认同方式，地方与全球彼此缠绕。",
         links:[]}
      ]
    },
    {
      id:"strathern", name:"玛丽琳·斯特拉森", en:"Marilyn Strathern",
      born:1941, died:null, country:"英国", period:"contemp",
      branches:["mind","theory"], regions:["巴布亚新几内亚","美拉尼西亚"],
      tags:["礼物与商品","关系性人格","自然之后"],
      summary:"美拉尼西亚研究大家与本体论转向的先驱。她指出西方个体观并非普适，人格是关系性的，进而拆解“自然/文化”的二分。",
      statements:[
        {id:"strathern-gift", year:1988, branch:"mind", work:"《礼物的性别》",
         text:"美拉尼西亚的人格是关系性的：礼物与商品的对立本身是西方范畴。",
         links:[{to:"mauss-gift", type:"agree", note:"礼物范式的当代重读与批判。"}]},
        {id:"strathern-nature", year:1992, branch:"theory", work:"《自然之后》",
         text:"“自然”也是文化概念：自然/文化的二分需要被人类学重新检验。",
         links:[
           {to:"descola-ontology", type:"agree", note:"本体论转向的英国版本。"},
           {to:"latour-modern", type:"agree", note:"共同瓦解自然/社会二分。"}
         ]}
      ]
    },
    {
      id:"descola", name:"菲利普·德斯科拉", en:"Philippe Descola",
      born:1949, died:null, country:"法国", period:"contemp",
      branches:["theory","religion"], regions:["亚马逊","阿丘雅人"],
      tags:["四种本体论","泛灵论","自然主义"],
      summary:"本体论转向的代表人物。他以四种存在论图式——泛灵论、图腾制、自然主义、类比主义——重画人类与非人类关系的世界图景。",
      statements:[
        {id:"descola-ontology", year:2005, branch:"theory", work:"《超越自然与文化》",
         text:"四种本体论：不同的存在论图式组织着人类与非人类之间的连续与断裂。",
         links:[{to:"viveiros-perspectivism", type:"agree", note:"与亚马逊视角主义共享本体论转向的问题意识。"}]},
        {id:"descola-naturalism", year:2005, branch:"religion", work:"《超越自然与文化》",
         text:"“自然主义”（自然/文化二分）只是西方特有的图式，并非人类的普遍经验。",
         links:[]}
      ]
    },
    {
      id:"viveiros", name:"爱德华多·维韦罗斯·德·卡斯特罗", en:"Eduardo Viveiros de Castro",
      born:1951, died:null, country:"巴西", period:"contemp",
      branches:["theory","religion"], regions:["亚马逊"],
      tags:["视角主义","多物种","食人本体论"],
      summary:"亚马逊视角主义与“多物种民族志”的旗手。他主张在美洲原住民的世界里，人与动物共享文化而身体各异，视角决定世界的样子。",
      statements:[
        {id:"viveiros-perspectivism", year:1998, branch:"theory", work:"《宇宙论指示与美洲印第安视角主义》",
         text:"视角主义：人与非人共享文化而身体不同，视角决定各自看到的世界。",
         links:[{to:"strathern-gift", type:"agree", note:"关系性人格与本体论多元的南美版本。"}]},
        {id:"viveiros-multispecies", year:2009, branch:"religion", work:"《食人形而上学》",
         text:"人类学应当研究人与非人的共存：食人、萨满与多物种的关系本体论。",
         links:[
           {to:"tsing-mushroom", type:"agree", note:"多物种转向的共同推动者。"},
           {to:"latour-actors", type:"agree", note:"把非人行动者纳入社会分析。"}
         ]}
      ]
    },
    {
      id:"latour", name:"布鲁诺·拉图尔", en:"Bruno Latour",
      born:1947, died:2022, country:"法国", period:"contemp",
      branches:["theory","global"], regions:["科特迪瓦","巴黎","实验室"],
      tags:["行动者网络","非现代","实验室研究"],
      summary:"从人类学田野走入科学研究的哲学家。他以实验室研究与行动者网络理论证明：科学事实与社会秩序都是被建造的网络。",
      statements:[
        {id:"latour-lab", year:1979, branch:"theory", work:"《实验室生活》",
         text:"实验室研究：科学事实是行动者网络中被建造出来的“事实”。",
         links:[]},
        {id:"latour-modern", year:1991, branch:"global", work:"《我们从未现代过》",
         text:"现代性的“纯化”与“杂合”并行：自然—社会的二分从未真正成立。",
         links:[]},
        {id:"latour-actors", year:1999, branch:"theory", work:"《潘多拉的希望》",
         text:"给予非人者能动性：微生物、仪器与田野同样是社会过程的行动者。",
         links:[]}
      ]
    },
    {
      id:"tsing", name:"罗安清（崔静）", en:"Anna Lowenhaupt Tsing",
      born:1952, died:null, country:"美国", period:"contemp",
      branches:["economic","global","theory"], regions:["印尼","北美森林"],
      tags:["摩擦","多物种","松茸"],
      summary:"多物种民族志的代表人物。她以“摩擦”描述全球连接的差异与不平等，并以松茸供应链呈现资本废墟中的共存与生计。",
      statements:[
        {id:"tsing-friction", year:2005, branch:"global", work:"《摩擦》",
         text:"摩擦：全球连接并非平滑流动，差异与不平等在接触带中产生动力。",
         links:[{to:"appadurai-global", type:"agree", note:"对全球流动理论的民族志修正。"}]},
        {id:"tsing-mushroom", year:2015, branch:"economic", work:"《在世界尽头遇见蘑菇》",
         text:"松茸的供应链串联森林、采集者与资本：废墟中的生计与多物种共存。",
         links:[{to:"latour-actors", type:"agree", note:"行动者网络与多物种取向的汇合。"}]}
      ]
    },
    {
      id:"abu-lughod", name:"莉拉·阿布-卢格霍德", en:"Lila Abu-Lughod",
      born:1952, died:null, country:"美国 / 巴勒斯坦", period:"contemp",
      branches:["mind","global"], regions:["埃及","贝都因人"],
      tags:["情感与诗歌","抵抗","书写反文化"],
      summary:"中东民族志大家。她以贝都因人的诗歌研究展示情感与抵抗的微妙关系，并呼吁“书写反文化”，警惕“文化”概念固化他者。",
      statements:[
        {id:"abu-poetry", year:1986, branch:"mind", work:"《面纱的情感》",
         text:"贝都因人的诗歌：在权力压迫之下，诗歌成为表达异议与情感的安全方式。",
         links:[
           {to:"geertz-deep", type:"agree", note:"把意义分析放进权力关系。"},
           {to:"rosaldo-passion", type:"agree", note:"情感人类学的核心案例。"}
         ]},
        {id:"abu-writing", year:1991, branch:"global", work:"《书写反文化》",
         text:"“文化”概念可能固化他者：写作应当反对本质化的文化差异。",
         links:[{to:"clifford-authority", type:"agree", note:"实验民族志批判的延伸。"}]}
      ]
    },
    {
      id:"obeyesekere", name:"加纳纳特·奥贝耶塞凯雷", en:"Gananath Obeyesekere",
      born:1930, died:null, country:"斯里兰卡", period:"contemp",
      branches:["religion","global"], regions:["斯里兰卡","夏威夷"],
      tags:["库克船长之争","实践理性"],
      summary:"以“库克船长是否被当作神”的论战闻名的人类学家，主张夏威夷人拥有自身的实践理性，而非依附于外来神话图式。",
      statements:[
        {id:"obeyesekere-cook", year:1992, branch:"religion", work:"《库克船长的神化》",
         text:"库克船长不是神：夏威夷人以其自身的实践理性应对来客，“神化”是被建构的叙事。",
         links:[{to:"sahlins-islands", type:"disagree", note:"与萨林斯的结构—历史解释针锋相对。"}]}
      ]
    },
    {
      id:"freeman", name:"德里克·弗里曼", en:"Derek Freeman",
      born:1916, died:2001, country:"新西兰 / 澳大利亚", period:"contemp",
      branches:["mind"], regions:["萨摩亚"],
      tags:["萨摩亚争论","生物与文化"],
      summary:"因对米德萨摩亚研究的再访与批评而载入学科史，他认为当地信息人的讲述误导了米德，青春期行为不能只归因于文化。",
      statements:[
        {id:"freeman-revisit", year:1983, branch:"mind", work:"《玛格丽特·米德与萨摩亚》",
         text:"萨摩亚再访：米德被当地讲述所误导，青春期的生物学因素不容忽视。",
         links:[{to:"mead-samoa", type:"disagree", note:"人类学史上最著名的论战之一。"}]}
      ]
    },
    {
      id:"fei", name:"费孝通", en:"Fei Xiaotong",
      born:1910, died:2005, country:"中国", period:"interp",
      branches:["kinship","economic","theory"], regions:["江苏开弦弓村","中国"],
      tags:["江村经济","差序格局","乡土中国","多元一体"],
      summary:"中国社会学与人类学的奠基人。他以江村研究开创经济人类学的中国范式，又以“差序格局”刻画中国社会的关系结构。",
      statements:[
        {id:"fei-peasant", year:1939, branch:"economic", work:"《江村经济》",
         text:"《江村经济》：一个村庄的消费、生产与亲属网络，呈现中国农村社会的完整图景。",
         links:[{to:"malinowski-method", type:"agree", note:"马林诺夫斯基作序：从海岛到中国乡村的田野研究扩展。"}]},
        {id:"fei-chaxu", year:1947, branch:"kinship", work:"《乡土中国》",
         text:"差序格局：中国人的关系以自我为中心、按亲疏水波式外推，而非西方团体格局。",
         links:[{to:"schneider-american", type:"agree", note:"亲属与关系是文化范畴，而不只是谱系计算。"}]},
        {id:"fei-ritual", year:1947, branch:"political", work:"《乡土中国》",
         text:"礼治秩序：乡土社会依靠教化与习俗维持秩序，而非国家法律。",
         links:[{to:"gluckman-judicial", type:"agree", note:"与习惯法研究相互印证。"}]},
        {id:"fei-multiunity", year:1988, branch:"global", work:"《中华民族的多元一体格局》",
         text:"中华民族的多元一体格局：各民族在长期历史互动中形成不可分割的整体。",
         links:[]}
      ]
    },
    {
      id:"lin", name:"林耀华", en:"Lin Yaohua",
      born:1910, died:2000, country:"中国", period:"interp",
      branches:["kinship"], regions:["福建","凉山"],
      tags:["金翼","宗族","凉山彝家"],
      summary:"中国人类学的代表人物之一。他既是家族个案研究的先驱，也系统研究了凉山彝家的亲属制度与等级结构。",
      statements:[
        {id:"lin-golden", year:1944, branch:"kinship", work:"《金翼》",
         text:"《金翼》：两个家族的兴衰史展现宗族、姻亲与市场网络如何编织地方社会。",
         links:[{to:"fei-peasant", type:"agree", note:"同一学术传统中的中国家族个案研究。"}]},
        {id:"lin-lolo", year:1947, branch:"kinship", work:"《凉山彝家》",
         text:"凉山彝家的亲属与等级研究，呈现中国民族志对“简单社会”的理论关怀。",
         links:[{to:"radcliffe-brown-structure", type:"agree", note:"世系与等级结构的中国案例。"}]}
      ]
    },
    {
      id:"yan", name:"阎云翔", en:"Yunxiang Yan",
      born:1954, died:null, country:"中国 / 美国", period:"contemp",
      branches:["kinship","economic"], regions:["黑龙江下岬村"],
      tags:["礼物的流动","私人生活","个体化"],
      summary:"以东北乡村的长期回访著称。他研究礼物流动与人情网络的当代变化，也记录了中国家庭与私人生活的个体化转型。",
      statements:[
        {id:"yan-gift", year:1996, branch:"economic", work:"《礼物的流动》",
         text:"下岬村的礼物流动显示：人情与关系网络是乡土社会再生产的核心机制。",
         links:[
           {to:"fei-chaxu", type:"agree", note:"对“差序格局”的当代经验检验。"},
           {to:"mauss-gift", type:"agree", note:"礼物范式在中国乡村的验证与修正。"}
         ]},
        {id:"yan-private", year:2003, branch:"kinship", work:"《私人生活的变革》",
         text:"集体化与市场化重塑了家庭与情感：私人生活从家族伦理中逐步脱离。",
         links:[{to:"ortner-practice", type:"agree", note:"实践与能动性视角下的中国家庭变迁。"}]}
      ]
    },
    {
      id:"childe", name:"戈登·柴尔德", en:"V. Gordon Childe",
      born:1892, died:1957, country:"英国 / 澳大利亚", period:"struct",
      branches:["archaeology"], regions:["欧洲","中东"],
      tags:["新石器革命","城市革命","文化史考古"],
      summary:"二十世纪最有影响的史前考古学家。他以“新石器革命”“城市革命”概括社会演化的大转折，并奠定文化史考古学的方法框架。",
      statements:[
        {id:"childe-neolithic", year:1936, branch:"archaeology", work:"《人类创造自身》",
         text:"新石器革命与城市革命：谷物、定居与剩余带来社会分层与早期国家。",
         links:[]},
        {id:"childe-culturehistory", year:1925, branch:"archaeology", work:"《欧洲文明的曙光》",
         text:"文化史考古学：以器物组合界定“考古文化”，并追踪其传播与演变。",
         links:[]}
      ]
    },
    {
      id:"binford", name:"路易斯·宾福德", en:"Lewis Binford",
      born:1931, died:2011, country:"美国", period:"interp",
      branches:["archaeology","theory"], regions:["美国","北极"],
      tags:["新考古学","过程考古学","中程理论"],
      summary:"“新考古学”的旗手。他要求考古学成为解释文化过程的人类学，并以民族考古学建立遗存与行为之间的推理桥梁。",
      statements:[
        {id:"binford-science", year:1962, branch:"archaeology", work:"《作为人类学的考古学》",
         text:"考古学即人类学：遗存应当回答社会与文化过程的规律问题，而不只是编年与文化史。",
         links:[{to:"childe-culturehistory", type:"disagree", note:"新考古学批评文化史方法，却继承了其社会演化的问题意识。"}]},
        {id:"binford-midrange", year:1977, branch:"archaeology", work:"《建立考古学理论》",
         text:"中程理论：用民族考古学在静态遗存与动态行为之间建立可检验的推论。",
         links:[]}
      ]
    },
    {
      id:"hodder", name:"伊恩·霍德", en:"Ian Hodder",
      born:1948, died:null, country:"英国", period:"contemp",
      branches:["archaeology"], regions:["土耳其","恰塔霍裕克"],
      tags:["后过程考古","物质文化","解释考古"],
      summary:"后过程考古学的创始人。他主张器物与风格是能动的象征，考古解释必然包含当代的政治与意义争夺。",
      statements:[
        {id:"hodder-symbolic", year:1982, branch:"archaeology", work:"《行动中的象征》",
         text:"物质文化是能动的象征：器物与风格参与社会策略与身份建构。",
         links:[
           {to:"douglas-grid", type:"agree", note:"象征分类分析在考古学中的运用。"},
           {to:"childe-culturehistory", type:"disagree", note:"批评文化史与传播论把物质文化当作被动标记。"}
         ]},
        {id:"hodder-reading", year:1986, branch:"archaeology", work:"《解读过去》",
         text:"后过程考古：物质文化是“文本”，解释必然包含当代的立场与政治。",
         links:[{to:"binford-science", type:"disagree", note:"过程考古的科学主义与后过程考古的解释学之争。"}]}
      ]
    },
    {
      id:"washburn", name:"舍伍德·沃什伯恩", en:"Sherwood Washburn",
      born:1911, died:2000, country:"美国", period:"struct",
      branches:["biological"], regions:["美国","非洲"],
      tags:["新体质人类学","功能解剖","灵长类"],
      summary:"“新体质人类学”的倡导者。他推动体质人类学从形态测量转向遗传学与功能解剖，并把灵长类行为研究纳入人类进化的解释。",
      statements:[
        {id:"washburn-newphys", year:1951, branch:"biological", work:"《新体质人类学》",
         text:"人类进化研究应基于遗传学与功能解剖的实验方法，而非静态的人种测量。",
         links:[{to:"boas-fourfields", type:"disagree", note:"体质研究脱离四分支的文化史框架，走向生物科学。"}]},
        {id:"washburn-primate", year:1951, branch:"biological", work:"《新体质人类学》",
         text:"行为与形态相应演化：野外灵长类研究是理解人类行为进化的窗口。",
         links:[]}
      ]
    },
    {
      id:"montagu", name:"阿什利·蒙塔古", en:"Ashley Montagu",
      born:1905, died:1999, country:"英国 / 美国", period:"struct",
      branches:["biological","global"], regions:["英国","美国"],
      tags:["种族神话","UNESCO","反种族主义"],
      summary:"以科学反击种族主义的代表。他的《人类最危险的神话》系统拆解种族概念，并为联合国教科文组织起草了战后首份种族宣言。",
      statements:[
        {id:"montagu-myth", year:1942, branch:"biological", work:"《人类最危险的神话：种族谬误》",
         text:"种族是一个社会神话：所谓种族差异其实是渐变的地理连续体。",
         links:[{to:"boas-relativism", type:"agree", note:"与博厄斯的反种族主义科学立场一脉相承。"}]},
        {id:"montagu-unesco", year:1950, branch:"global", work:"《UNESCO 种族宣言》",
         text:"科学界应当明确拒绝以生物学论证种族不平等的任何企图。",
         links:[]}
      ]
    },
    {
      id:"lewontin", name:"理查德·列文廷", en:"Richard Lewontin",
      born:1929, died:2021, country:"美国", period:"interp",
      branches:["biological"], regions:["美国"],
      tags:["群体遗传学","生物决定论批判"],
      summary:"进化遗传学家与生物决定论的坚定批判者。他用群体遗传学数据证明人类变异主要存在于群体内部，“人种”之间的差异极小。",
      statements:[
        {id:"lewontin-apportionment", year:1972, branch:"biological", work:"《人类多样性的分配》",
         text:"人类遗传变异的约 85% 存在于群体内部；所谓“人种”之间的差异极小。",
         links:[{to:"montagu-unesco", type:"agree", note:"为反种族主义提供了群体遗传学证据。"}]},
        {id:"lewontin-genes", year:1984, branch:"biological", work:"《不在我们的基因里》",
         text:"生物决定论是意识形态而非科学结论：社会不平等不能化约为基因。",
         links:[{to:"freeman-revisit", type:"disagree", note:"反对把行为差异主要归因于生物天性。"}]}
      ]
    },
    {
      id:"goodall", name:"珍·古道尔", en:"Jane Goodall",
      born:1934, died:null, country:"英国", period:"interp",
      branches:["biological"], regions:["坦桑尼亚贡贝"],
      tags:["黑猩猩","长期田野","工具使用"],
      summary:"灵长类研究的象征人物。她在贡贝的长期观察证明黑猩猩会制造工具、拥有复杂社会与情感生活，改变了人类独特性的定义。",
      statements:[
        {id:"goodall-tools", year:1971, branch:"biological", work:"《在人类的阴影下》",
         text:"黑猩猩会制造和使用工具：人类的独特性因此需要重新定义。",
         links:[{to:"washburn-primate", type:"agree", note:"野外灵长类研究作为理解人类进化的窗口。"}]},
        {id:"goodall-gombe", year:1986, branch:"biological", work:"《贡贝的黑猩猩》",
         text:"长期、个体化的野外观察，是理解灵长类社会与情感的必要方法。",
         links:[]}
      ]
    },
    {
      id:"dewaal", name:"弗朗斯·德瓦尔", en:"Frans de Waal",
      born:1948, died:2024, country:"荷兰 / 美国", period:"contemp",
      branches:["biological","mind"], regions:["荷兰","美国"],
      tags:["黑猩猩政治","动物道德","共情"],
      summary:"灵长类社会行为研究的代表。他以黑猩猩的联盟与权力斗争研究著称，并论证共情与公平感在演化上有着深厚根基。",
      statements:[
        {id:"dewaal-politics", year:1982, branch:"biological", work:"《黑猩猩的政治》",
         text:"黑猩猩的联盟、欺骗与权力斗争，显示政治行为的演化连续性。",
         links:[{to:"goodall-gombe", type:"agree", note:"延续长期个体观察的传统。"}]},
        {id:"dewaal-morality", year:1996, branch:"mind", work:"《善良的本性》",
         text:"动物道德：共情与公平感的演化根基，挑战“文化/自然”的绝对分界。",
         links:[{to:"descola-naturalism", type:"agree", note:"为人类与动物的连续性提供了行为学证据。"}]}
      ]
    },
    {
      id:"kleinman", name:"凯博文", en:"Arthur Kleinman",
      born:1941, died:null, country:"美国", period:"contemp",
      branches:["mind","global"], regions:["台湾","中国大陆","美国"],
      tags:["医学人类学","解释模型","疾病叙事"],
      summary:"医学人类学的奠基人之一。他把“深描”带入医疗场域，以解释模型与疾病叙事呈现病痛的意义维度，深刻影响全球医学人文教育。",
      statements:[
        {id:"kleinman-models", year:1980, branch:"mind", work:"《文化情境中的病人与医者》",
         text:"解释模型：病人、家属与医者对疾病的理解各不相同，医疗是意义的协商。",
         links:[{to:"geertz-interpretation", type:"agree", note:"把深描与意义分析应用于医疗场域。"}]},
        {id:"kleinman-narratives", year:1988, branch:"mind", work:"《疾病叙事》",
         text:"疾病叙事：躯体症状与道德意义相连，病痛经验应当被当作叙事来理解。",
         links:[{to:"rosaldo-passion", type:"agree", note:"情感与经验研究在医学人类学中的延伸。"}]}
      ]
    }
  ]
};
