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
    version: "work in progress v0.2",
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
            "appadurai","fei","ingold","haraway","das","farmer"],

  people: [

    /* ---------------- 古典时期 ---------------- */
    {
      id:"bastian", name:"阿道夫·巴斯蒂安", en:"Adolf Bastian",
      born:1826, died:1905, country:"德国", period:"pre",
      branches:["theory","religion"], regions:["柏林","环球旅行"],
      tags:["民族学","基本思想","博物馆"],
      summary:"德国民族学与博物馆事业的奠基者。他主张人类心理的统一性，认为各民族文化是同一套“基本思想”在不同地理历史条件下的变体。",
      statements:[
        {id:"bastian-psychic", key:true, year:1860, branch:"theory", work:"《历史上的人》",
         text:"各民族共享同一套“基本思想”（Elementargedanken），差异来自地理与历史环境中的“民族思想”。",
         links:[]},
        {id:"bastian-museum", year:1873, branch:"theory", work:"柏林民族学博物馆",
         text:"博物馆应系统收藏各民族的物质文化，作为人类心理统一的实物证据。",
         links:[]},
        {id:"bastian-vokergedanken", year:1881, branch:"theory", work:"《民族学基础》",
         text:"“元素思想”是人类的共同底层，“民族思想”则是各地理省区在历史中形成的变体；民族学的任务是登记前者、比较后者。",
         links:[{to:"bastian-psychic", type:"agree", note:"同一“基本思想”命题的系统化表述。"}]},
        {id:"bastian-diffusion", key:true, year:1866, branch:"theory", work:"《东亚民族》",
         text:"文化相似性既可以来自共同的心理基础，也可以来自接触与传播；必须先厘清地理分布，再谈起源。",
         links:[
           {to:"boas-historism", type:"agree", note:"把传播与历史具体性置于普遍进化图式之前，博厄斯继承了这一警惕。"},
           {to:"tylor-survivals", type:"disagree", note:"反对以“遗存”直接推断普遍进化阶段。"}
         ]}
      ]
    },
    {
      id:"tylor", name:"爱德华·伯内特·泰勒", en:"Edward Burnett Tylor",
      born:1832, died:1917, country:"英国", period:"pre",
      branches:["religion","theory"], regions:["墨西哥","英国"],
      tags:["古典进化论","文化定义","万物有灵论","遗存"],
      summary:"英国人类学的奠基人，给出了学科史上第一个系统性的“文化”定义，并以进化论框架比较宗教与习俗的起源。",
      statements:[
        {id:"tylor-culture", key:true, year:1871, branch:"theory", work:"《原始文化》",
         text:"文化是一个复合整体：知识、信仰、艺术、道德、法律、习俗，以及人作为社会成员所获得的一切能力与习惯。",
         links:[]},
        {id:"tylor-animism", key:true, year:1871, branch:"religion", work:"《原始文化》",
         text:"万物有灵论是宗教的起源；宗教沿着巫术—多神教—一神教的方向不断进化。",
         links:[{to:"frazer-goldengod", type:"agree", note:"弗雷泽接续了这条巫术—宗教—科学的进化阶梯。"}]},
        {id:"tylor-survivals", year:1871, branch:"religion", work:"《原始文化》",
         text:"“遗存”（survivals）是过去习俗的化石，可以据以重建文化的发展史。",
         links:[]},
        {id:"tylor-early-history", year:1865, branch:"theory", work:"《人类早期历史研究》",
         text:"文化要素的相似可由“独立发明”或“传播”解释；神话与技术的比较需要先排除借用，再判断演化。",
         links:[{to:"bastian-diffusion", type:"agree", note:"与巴斯蒂安一样强调传播与比较的前提。"}]},
        {id:"tylor-adhesion", year:1889, branch:"theory", work:"《论调查制度发展的一种方法》",
         text:"用统计方法检验习俗之间的相关性（“粘连”）：把跨文化比较从印象变成可检验的操作。",
         links:[{to:"morgan-kinterms", type:"agree", note:"同属以系统分类处理亲属与制度材料的尝试。"}]}
      ]
    },
    {
      id:"morgan", name:"路易斯·亨利·摩尔根", en:"Lewis Henry Morgan",
      born:1818, died:1881, country:"美国", period:"pre",
      branches:["kinship","theory"], regions:["易洛魁联盟","北美"],
      tags:["古典进化论","亲属称谓","氏族"],
      summary:"美国人类学先驱。他以易洛魁人的田野记录和全球亲属称谓比较为基础，提出社会沿蒙昧—野蛮—文明三阶段进化的宏大框架。",
      statements:[
        {id:"morgan-stages", key:true, year:1877, branch:"theory", work:"《古代社会》",
         text:"人类社会沿蒙昧—野蛮—文明三阶段单线进化，技术发明与财产形式是主要标尺。",
         links:[{to:"tylor-culture", type:"agree", note:"与泰勒同属古典进化论阵营。"}]},
        {id:"morgan-kinterms", key:true, year:1871, branch:"kinship", work:"《人类家庭的血亲和姻亲制度》",
         text:"亲属称谓不是随意的命名，而是记录婚姻与家庭制度的“化石”。",
         links:[{to:"levy-strauss-alliance", type:"disagree", note:"列维-斯特劳斯抛弃阶段论，但接续并重建了亲属称谓的系统研究。"}]},
        {id:"morgan-iroquois", year:1851, branch:"kinship", work:"《易洛魁联盟》",
         text:"易洛魁人的氏族组织证明：社会结构可以被细致观察、记录并进行比较。",
         links:[{to:"lin-lolo", type:"agree", note:"与林耀华对凉山彝家的亲属与等级研究前后呼应。"}]},
        {id:"morgan-house", year:1881, branch:"archaeology", work:"《美洲原住民的房屋与家庭生活》",
         text:"房屋形制与居住方式记录了家庭形态的演变；考古遗存可以补写没有文字的社会史。",
         links:[{to:"morgan-stages", type:"agree", note:"为进化序列提供物质证据。"}]},
        {id:"morgan-civitas", year:1877, branch:"political", work:"《古代社会》",
         text:"政治社会的演化是从血缘组织（societas）走向以地域与财产为基础的国家（civitas）。",
         links:[
           {to:"morgan-stages", type:"agree", note:"《古代社会》的另一条主线：社会组织基础的更替。"},
           {to:"fortes-politics", type:"disagree", note:"非洲学派证明无国家社会同样有稳定的政治秩序，不必视为进化阶段中的一环。"}
         ]}
      ]
    },
    {
      id:"frazer", name:"詹姆斯·乔治·弗雷泽", en:"James George Frazer",
      born:1854, died:1941, country:"英国", period:"pre",
      branches:["religion"], regions:["剑桥","意大利","全球比较材料"],
      tags:["比较宗教学","交感巫术","金枝"],
      summary:"以《金枝》闻名的比较宗教学者，用全球神话与民俗材料勾勒巫术、宗教到科学的“思想进化史”，是“扶手椅人类学”的集大成者。",
      statements:[
        {id:"frazer-goldengod", key:true, year:1890, branch:"religion", work:"《金枝》",
         text:"巫术、宗教与科学是思想进化的三个阶段；交感巫术基于相似与接触的联想原理。",
         links:[]},
        {id:"frazer-king", year:1890, branch:"religion", work:"《金枝》",
         text:"杀王与植物神神话共享同一模式：王权、丰产与周期性更新的普遍叙事。",
         links:[{to:"levy-strauss-myth", type:"disagree", note:"列维-斯特劳斯把同类材料从“进化阶段”改问为“结构变换”。"}]},
        {id:"frazer-totemism", year:1887, branch:"religion", work:"《图腾制》",
         text:"把世界各地的图腾习俗汇编为比较材料，图腾制度被当作宗教演化的早期阶段。",
         links:[
           {to:"levy-strauss-totemism", type:"disagree", note:"列维-斯特劳斯反对把图腾当作进化阶段，改读为分类逻辑。"},
           {to:"radcliffe-brown-totemism", type:"disagree", note:"拉德克利夫-布朗拒绝进化论解释，转向图腾与世系、资源的社会学关联。"}
         ]},
        {id:"frazer-magic-religion", key:true, year:1911, branch:"religion", work:"《金枝》（第三版）",
         text:"巫术—宗教—科学的三阶段：先以交感巫术控制自然，失败后乞灵于神，最终归于科学。",
         links:[
           {to:"malinowski-magic", type:"disagree", note:"马林诺夫斯基指出巫术并非错误科学的残留，而是应对不确定性的实践。"},
           {to:"tylor-animism", type:"agree", note:"延续以心智进化解释宗教起源的写法。"}
         ]}
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
        {id:"boas-relativism", key:true, year:1911, branch:"theory", work:"《原始人的心智》",
         text:"文化相对主义：各族群的行为与观念应在其自身历史脉络中理解，种族决定论在科学上不成立。",
         links:[
           {to:"bastian-psychic", type:"agree", note:"承接巴斯蒂安的心理统一论，但转向历史与经验的具体性。"},
           {to:"morgan-stages", type:"disagree", note:"反对单线进化与种族等级的文化序列。"}
         ]},
        {id:"boas-historism", key:true, year:1896, branch:"theory", work:"《人类学比较方法的局限》",
         text:"历史特殊论：文化差异来自特定的历史过程与传播，而非普遍进化规律。",
         links:[{to:"tylor-animism", type:"disagree", note:"拒绝把宗教与习俗塞进统一的进化阶段。"}]},
        {id:"boas-fieldwork", year:1920, branch:"theory", work:"《民族学方法》",
         text:"民族志必须基于当地语言与长期田野，反对二手材料拼贴出的比较研究。",
         links:[{to:"malinowski-method", type:"agree", note:"与英国功能主义同倡长期田野，但理论路径不同。"}]},
        {id:"boas-fourfields", year:1904, branch:"theory", work:"《人类学的历史》",
         text:"人类学应整合体质、语言、考古与文化研究，构成统一的四分支学科。",
         links:[]},
        {id:"boas-immigrant-headform", key:true, year:1912, branch:"biological", work:"《移民后代体格形态的变化》",
         text:"移民后代头骨形态随环境改变，证明“种族类型”并非固定不变，体质特征具有可塑性。",
         links:[
           {to:"boas-relativism", type:"agree", note:"用体质证据拆解种族决定论，与《原始人的心智》的批判同构。"},
           {to:"montagu-myth", type:"agree", note:"为后来的反种族主义科学论证提供基础。"}
         ]},
        {id:"boas-kwakiutl", year:1897, branch:"kinship", work:"《夸扣特尔人的社会结构》",
         text:"夸富宴以赠予与销毁财产竞争声望；氏族、等级与特权通过仪式性消费再生产。",
         links:[
           {to:"mauss-gift", type:"agree", note:"莫斯《礼物》的核心民族志来源之一。"},
           {to:"mintz-sugar", type:"disagree", note:"米茨后来批评：把夸富宴读成纯粹的声望竞争，遮蔽了殖民贸易带来的财富剧变。"}
         ]}
      ]
    },
    {
      id:"durkheim", name:"埃米尔·涂尔干", en:"Émile Durkheim",
      born:1858, died:1917, country:"法国", period:"found",
      branches:["religion","theory"], regions:["法国","澳大利亚"],
      tags:["社会事实","集体意识","神圣与凡俗"],
      summary:"社会学奠基人，也是人类学最重要的理论源头之一。他把社会事实当作“物”来研究，并以澳洲图腾制度说明宗教的社会本质。",
      statements:[
        {id:"durkheim-rules", key:true, year:1895, branch:"theory", work:"《社会学方法的准则》",
         text:"社会事实应被当作“物”来研究；社会先于个体，不可还原为个体心理。",
         links:[]},
        {id:"durkheim-elementary", key:true, year:1912, branch:"religion", work:"《宗教生活的基本形式》",
         text:"宗教的本质是社会：神圣与凡俗的二分，以及集体欢腾所生产的集体意识。",
         links:[]},
        {id:"durkheim-division", year:1893, branch:"theory", work:"《社会分工论》",
         text:"从“机械团结”到“有机团结”：分工把社会整合的重心从相似性转移到相互依赖。",
         links:[{to:"durkheim-elementary", type:"agree", note:"同一问题——社会如何可能——在劳动分工层面的展开。"}]},
        {id:"durkheim-suicide", year:1897, branch:"theory", work:"《自杀论》",
         text:"自杀率随社会整合与规范强度变化：个体行为可以被当作“社会事实”来解释。",
         links:[{to:"durkheim-rules", type:"agree", note:"《自杀论》是《社会学方法的准则》最著名的示范。"}]}
      ]
    },
    {
      id:"mauss", name:"马塞尔·莫斯", en:"Marcel Mauss",
      born:1872, died:1950, country:"法国", period:"found",
      branches:["economic","theory","religion"], regions:["法国","波利尼西亚材料"],
      tags:["礼物","互惠","总体社会事实","身体技术"],
      summary:"涂尔干的合作者与侄子，法国社会学派的核心人物。他的《礼物》奠定了交换与互惠研究的范式，至今仍是人类学被引用最多的文本之一。",
      statements:[
        {id:"mauss-gift", key:true, year:1925, branch:"economic", work:"《礼物》",
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
         links:[{to:"durkheim-rules", type:"agree", note:"法国社会学派宗教研究的纲领性成果。"}]},
        {id:"mauss-person", key:true, year:1938, branch:"theory", work:"《一种人的概念》",
         text:"“人”与“自我”并非普遍范畴，而是一段从角色面具到道德人格的历史建构。",
         links:[
           {to:"dumont-homo", type:"agree", note:"杜蒙把“个体主义”当作现代意识形态，正是这一思路的延伸。"},
           {to:"geertz-deep", type:"agree", note:"文化与人格研究共享的命题：人的范畴有历史与文化条件。"}
         ]},
        {id:"mauss-eskimo", year:1906, branch:"economic", work:"《论爱斯基摩社会的季节性变化》",
         text:"社会形态学：社会生活的强度随季节在集中与分散之间摆动，物质基础与集体生活相互塑造。",
         links:[{to:"mauss-body", type:"agree", note:"同属身体技术之外的另一支“社会形态学”研究。"}]}
      ]
    },
    {
      id:"malinowski", name:"布罗尼斯拉夫·马林诺夫斯基", en:"Bronisław Malinowski",
      born:1884, died:1942, country:"英国（波兰裔）", period:"found",
      branches:["theory","economic","religion"], regions:["特罗布里恩德群岛"],
      tags:["参与观察","功能主义","库拉圈"],
      summary:"现代田野方法的奠基者。他在特罗布里恩德群岛的长期居住研究，确立了参与观察与整体民族志的标准，并以“需要—功能”框架解释制度。",
      statements:[
        {id:"malinowski-method", key:true, year:1922, branch:"theory", work:"《西太平洋的航海者》",
         text:"民族志的目标是把握当地人的观点与其生活的整体，参与观察取代“扶手椅”比较法。",
         links:[{to:"frazer-goldengod", type:"disagree", note:"批评未经验证的比较材料无法解释实际生活。"}]},
        {id:"malinowski-functionalism", year:1922, branch:"theory", work:"《西太平洋的航海者》",
         text:"功能主义：制度存在的理由在于满足人的生物与社会需要。",
         links:[{to:"radcliffe-brown-structure", type:"disagree", note:"个体需要优先，还是社会结构优先？两派功能主义由此分道。"}]},
        {id:"malinowski-kula", key:true, year:1922, branch:"economic", work:"《西太平洋的航海者》",
         text:"库拉圈证明交换同时是经济的、仪式的与声望的，不能仅用功利理性解释。",
         links:[{to:"sahlins-affluent", type:"agree", note:"萨林斯据此提出“原初丰裕社会”。"}]},
        {id:"malinowski-crime", year:1926, branch:"political", work:"《原始社会的犯罪与习俗》",
         text:"法律不必依赖法庭：互惠义务与舆论本身构成无国家社会的约束力。",
         links:[]},
        {id:"malinowski-magic", year:1925, branch:"religion", work:"《巫术、科学与宗教》",
         text:"巫术出现在结果无法控制的活动领域；它与经验知识并存，而非原始思维的标志。",
         links:[
           {to:"frazer-magic-religion", type:"disagree", note:"以田野经验反驳巫术即“错误科学”的进化图式。"},
           {to:"levy-strauss-savage", type:"agree", note:"两条路径都否认“原始思维”与科学思维之间存在质的鸿沟。"}
         ]},
        {id:"malinowski-sex-family", year:1929, branch:"kinship", work:"《野蛮人的性生活》",
         text:"在母系社会中，生理父亲与“社会父亲”（舅父）的角色分离，证明亲属关系由社会约定而非生理事实决定。",
         links:[{to:"malinowski-functionalism", type:"agree", note:"功能分析在性与家庭领域的应用。"}]}
      ]
    },
    {
      id:"radcliffe-brown", name:"拉德克利夫-布朗", en:"A. R. Radcliffe-Brown",
      born:1881, died:1955, country:"英国", period:"found",
      branches:["theory","kinship","religion"], regions:["安达曼群岛","非洲"],
      tags:["结构功能主义","社会结构","世系理论"],
      summary:"英国结构功能主义领袖。他主张人类学应成为比较社会学，研究维持社会整体的关系网络，深刻影响了非洲世系研究与亲属理论。",
      statements:[
        {id:"radcliffe-brown-structure", key:true, year:1922, branch:"theory", work:"《安达曼岛人》",
         text:"社会结构是可观察的关系网络；社会学的任务是比较不同社会维持结构的形式。",
         links:[{to:"durkheim-elementary", type:"agree", note:"把涂尔干的社会学纲领改写成结构功能分析。"}]},
        {id:"radcliffe-brown-joking", year:1940, branch:"kinship", work:"《论戏谑关系》",
         text:"戏谑与回避关系是维持亲属结构中紧张与团结的调节机制。",
         links:[{to:"leach-burma", type:"disagree", note:"利奇指出结构并非稳定均衡，而是冲突与摇摆的过程。"}]},
        {id:"radcliffe-brown-function", key:true, year:1952, branch:"theory", work:"《原始社会的结构与功能》",
         text:"制度的功能在于维持社会整体的延续；对历史起源的推测无益于科学解释。",
         links:[]},
        {id:"radcliffe-brown-socialstructure", year:1940, branch:"theory", work:"《论社会结构》",
         text:"社会结构指被制度化的、持续存在的人际关系网络，而不是具体的人；它可用关系网络加以分析。",
         links:[
           {to:"radcliffe-brown-function", type:"agree", note:"把“结构”从一个比喻变成可分析的对象。"},
           {to:"levy-strauss-alliance", type:"agree", note:"列维-斯特劳斯承认这一“结构”定义，但把重点从关系网络转向心智模型。"}
         ]},
        {id:"radcliffe-brown-totemism", year:1929, branch:"religion", work:"《图腾制度的社会学理论》",
         text:"图腾动物之所以重要，是因为它把群体之间的社会对立自然化：自然物种成为区分人类群体的工具。",
         links:[
           {to:"frazer-totemism", type:"disagree", note:"拒绝“宗教早期阶段”的进化解释，改问图腾的社会功能。"},
           {to:"levy-strauss-totemism", type:"agree", note:"与列维-斯特劳斯同样把图腾放在分类而非信仰问题上。"}
         ]}
      ]
    },
    {
      id:"sapir", name:"爱德华·萨丕尔", en:"Edward Sapir",
      born:1884, died:1939, country:"美国", period:"found",
      branches:["language","mind"], regions:["北美印第安诸语言"],
      tags:["语言人类学","语言与文化","文化与个性"],
      summary:"博厄斯之后美国语言人类学的领袖，也是“文化与人格”研究的重要推动者。他主张语言是文化的符号系统，并最早系统论述语言与思维的关系。",
      statements:[
        {id:"sapir-language", key:true, year:1921, branch:"language", work:"《语言论》",
         text:"语言是文化的符号系统，语言学的分析方法可以推广到整个文化研究。",
         links:[]},
        {id:"sapir-culture", key:true, year:1924, branch:"mind", work:"《真实的文化与虚假的文化》",
         text:"真正的文化是个人与社会和谐互动的整体，而不是博物馆式的条目清单。",
         links:[{to:"benedict-patterns", type:"agree", note:"与本尼迪克特的文化型模研究同调。"}]},
        {id:"sapir-environment", year:1912, branch:"language", work:"《语言与环境》",
         text:"词汇会随环境与生活经验积累，但语音与语法结构不取决于环境：语言与文化的关联需要区分层次。",
         links:[{to:"sapir-language", type:"agree", note:"《语言论》中语言形式与文化内容相互独立的表述先声。"}]},
        {id:"sapir-status", year:1929, branch:"language", work:"《语言学作为一门科学的地位》",
         text:"语言是文化的“引导”，因为人部分地由语言所构成；语言学家因此对社会科学负有责任。",
         links:[{to:"whorf-relativity", type:"agree", note:"沃尔夫正是沿着这一提示提出语言相对论。"}]}
      ]
    },
    {
      id:"mead", name:"玛格丽特·米德", en:"Margaret Mead",
      born:1901, died:1978, country:"美国", period:"found",
      branches:["mind","global"], regions:["萨摩亚","新几内亚"],
      tags:["文化与人格","性别气质","青春期"],
      summary:"最具公众影响力的美国人类学家。她以萨摩亚与新几内亚研究论证青春期与性别气质是文化塑造的结果，晚年成为公共知识分子的象征。",
      statements:[
        {id:"mead-samoa", key:true, year:1928, branch:"mind", work:"《萨摩亚人的成年》",
         text:"萨摩亚少女的青春期没有西方式的焦虑：青春期的紧张是文化造成的，而非生理必然。",
         links:[{to:"boas-relativism", type:"agree", note:"用跨文化比较检验并推广文化相对主义的命题。"}]},
        {id:"mead-gender", key:true, year:1935, branch:"mind", work:"《三个原始部落的性别与气质》",
         text:"性别气质是文化塑造的：三个新几内亚部落展示了多样的性别气质组合。",
         links:[]},
        {id:"mead-newguinea", year:1930, branch:"mind", work:"《新几内亚儿童的成长》",
         text:"儿童养育方式塑造人格类型；社会化过程是可观察、可比较的经验过程。",
         links:[{to:"mead-samoa", type:"agree", note:"把青春期研究延伸为对养育与人格形成的研究。"}]},
        {id:"mead-male-female", year:1949, branch:"mind", work:"《男与女》",
         text:"性别角色是社会文化的安排：不同社会中“男性气质”“女性气质”的分配方式并不一致。",
         links:[
           {to:"mead-gender", type:"agree", note:"《三个原始部落的性别与气质》的普及与深化。"},
           {to:"rubin-traffic", type:"agree", note:"为后来的性别人类学与《女人交易》提供了经验基础。"},
           {to:"freeman-revisit", type:"disagree", note:"弗里曼质疑米德的田野证据与结论的可靠性。"}
         ]}
      ]
    },
    {
      id:"benedict", name:"鲁思·本尼迪克特", en:"Ruth Benedict",
      born:1887, died:1948, country:"美国", period:"found",
      branches:["mind","religion","global"], regions:["北美西南部","日本"],
      tags:["文化模式","日神型与酒神型","菊与刀"],
      summary:"博厄斯学派的代表人物，以“文化模式”概念把文化视为整合的价值整体。二战期间主持日本研究，写出影响深远的《菊与刀》。",
      statements:[
        {id:"benedict-patterns", key:true, year:1934, branch:"mind", work:"《文化模式》",
         text:"文化是一个整合的模式：个人的性格在文化模式中获得塑造与意义。",
         links:[{to:"boas-relativism", type:"agree", note:"把博厄斯的相对主义发展成文化整体论。"}]},
        {id:"benedict-apollonian", year:1934, branch:"mind", work:"《文化模式》",
         text:"日神型与酒神型：不同文化追求不同的价值极限，无法用单一进步尺度评判。",
         links:[{to:"morgan-stages", type:"disagree", note:"文化之间无高下，只有价值取向的差异。"}]},
        {id:"benedict-chrysanthemum", key:true, year:1946, branch:"global", work:"《菊与刀》",
         text:"远距研究：战争时期对日本的“远距离文化研究”证明文化与人格分析可用于理解敌国社会。",
         links:[{to:"mead-samoa", type:"agree", note:"同属文化与人格研究的方法谱系。"}]},
        {id:"benedict-race", year:1940, branch:"global", work:"《种族：科学与政治》",
         text:"种族主义是一种政治需要，而不是科学结论；“种族”概念应当被还原为历史与权力问题。",
         links:[
           {to:"montagu-myth", type:"agree", note:"与本尼迪克特、蒙塔古同属二战前后的反种族主义科学写作。"},
           {to:"boas-immigrant-headform", type:"agree", note:"引用体质人类学证据拆解种族类型论。"}
         ]},
        {id:"benedict-zuni", year:1935, branch:"religion", work:"《祖尼神话》",
         text:"神话不是杂乱的故事集，而是把文化模式反复叙述出来的整合系统。",
         links:[{to:"benedict-patterns", type:"agree", note:"把“文化模式”命题带入神话材料。"}]}
      ]
    },
    {
      id:"whorf", name:"本杰明·李·沃尔夫", en:"Benjamin Lee Whorf",
      born:1897, died:1941, country:"美国", period:"struct",
      branches:["language"], regions:["霍皮人","美国"],
      tags:["语言相对论","萨丕尔-沃尔夫假说"],
      summary:"萨丕尔的学生，语言相对论的代表。他比较霍皮语与印欧语的时间范畴，主张语法结构塑造习惯性的世界观。",
      statements:[
        {id:"whorf-relativity", key:true, year:1940, branch:"language", work:"《科学与语言学》",
         text:"语言相对论：语法范畴塑造习惯性的思维，霍皮语的时间经验不同于印欧语。",
         links:[{to:"sapir-culture", type:"agree", note:"把老师的语言文化观推向“语言塑造实在”。"}]},
        {id:"whorf-thought", year:1941, branch:"language", work:"《语言与逻辑》",
         text:"语言的分类方式即是经验的组织方式；比较语法就是比较世界观的路径。",
         links:[]},
        {id:"whorf-hopi-time", key:true, year:1936, branch:"language", work:"《美洲印第安人的宇宙模型》",
         text:"霍皮语的时间表达与欧洲语言不同：不同的语言把经验组织成不同的宇宙图像。",
         links:[{to:"whorf-thought", type:"agree", note:"为语言相对论提供语法证据。"}]},
        {id:"whorf-cryptotypes", year:1945, branch:"language", work:"《语法范畴》",
         text:"隐性范畴（如性、数、体的暗含分类）在无意识层面引导说话者注意世界的某些方面。",
         links:[{to:"whorf-relativity", type:"agree", note:"把相对论从词汇层面推进到语法与范畴层面。"}]}
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
        {id:"evans-pritchard-witchcraft", key:true, year:1937, branch:"religion", work:"《阿赞德人的巫术、神谕与魔法》",
         text:"阿赞德人的巫术是自洽的思维体系，不能以“原始思维”贬斥为迷信。",
         links:[{to:"tylor-animism", type:"disagree", note:"巫术不是进化遗存，而是日常生活中的理性说明制度。"}]},
        {id:"evans-pritchard-nuer", key:true, year:1940, branch:"political", work:"《努尔人》",
         text:"无国家社会同样拥有秩序：裂变制通过不断变动的对立关系维持政治平衡。",
         links:[{to:"radcliffe-brown-structure", type:"agree", note:"结构功能分析在非洲政治研究中的经典运用。"}]},
        {id:"evans-pritchard-history", year:1950, branch:"theory", work:"《社会人类学》（马雷特讲演）",
         text:"社会人类学应像历史学一样研究具体社会，而不是追求自然科学的普遍法则。",
         links:[{to:"radcliffe-brown-function", type:"disagree", note:"从“自然科学”理想退回解释与历史取向。"}]},
        {id:"ep-nuer-time", year:1940, branch:"theory", work:"《努尔人》",
         text:"努尔人的时间分为“生态时间”（与放牧、季节相关）与“结构时间”（与世系距离相关）；时间感是社会组织的产物。",
         links:[
           {to:"evans-pritchard-nuer", type:"agree", note:"《努尔人》的另一核心：时间与空间范畴由社会结构塑造。"},
           {to:"fabian-time", type:"disagree", note:"法比安批评：把“他者时间”描述为与世系绑定的另一套时间，仍是人类学把对象置于不同时间中的做法。"}
         ]},
        {id:"ep-sanusi", year:1949, branch:"political", work:"《昔兰尼加的塞努西教团》",
         text:"把历史文献与田野材料结合，分析伊斯兰教团如何成为部落社会的政治组织者。",
         links:[{to:"evans-pritchard-history", type:"agree", note:"与《社会人类学》讲演中“人类学与历史学应当合流”的主张呼应。"}]},
        {id:"ep-nuer-religion", year:1956, branch:"religion", work:"《努尔人的宗教》",
         text:"理解他者的宗教要用他者的语言：宗教不能被简单化约为社会结构的功能投射。",
         links:[
           {to:"durkheim-elementary", type:"disagree", note:"偏离涂尔干式的“宗教即社会自我崇拜”命题，保留信仰的自主性。"},
           {to:"geertz-religion", type:"agree", note:"与格尔茨一样主张从信仰者的意义世界内部理解宗教。"}
         ]}
      ]
    },
    {
      id:"firth", name:"雷蒙德·弗斯", en:"Raymond Firth",
      born:1901, died:2002, country:"英国", period:"struct",
      branches:["economic","theory"], regions:["蒂科皮亚岛"],
      tags:["经济人类学","社会过程","实质论"],
      summary:"马林诺夫斯基的继任者与批评性继承者。他以蒂科皮亚岛的长期研究说明社会结构在具体互动中不断被再生产，并开创经济人类学。",
      statements:[
        {id:"firth-process", key:true, year:1936, branch:"theory", work:"《我们，蒂科皮亚人》",
         text:"社会结构在具体互动与选择中被不断再生产，结构与过程不可分割。",
         links:[{to:"radcliffe-brown-structure", type:"agree", note:"把“结构”从静态框架改造为动态过程。"}]},
        {id:"firth-economy", key:true, year:1939, branch:"economic", work:"《原始波利尼西亚经济》",
         text:"经济人类学不能预设“经济人”：原始经济嵌在亲属与仪式的义务网络之中。",
         links:[{to:"sahlins-affluent", type:"agree", note:"实质论取向的先声。"}]},
        {id:"firth-organization", year:1951, branch:"theory", work:"《社会组织要素》",
         text:"“社会结构”之外还有“社会组织”：个体在结构约束下的选择、策略与安排同样值得研究。",
         links:[
           {to:"firth-process", type:"agree", note:"把《我们，蒂科皮亚人》中的过程视角提炼为概念区分。"},
           {to:"bourdieu-habitus", type:"agree", note:"实践取向的先声：结构不能完全决定行动。"},
           {to:"radcliffe-brown-socialstructure", type:"disagree", note:"反对把社会结构当作自足的、可脱离个体行动的分析对象。"}
         ]},
        {id:"firth-ritual", year:1967, branch:"religion", work:"《蒂科皮亚人的仪式与信仰》",
         text:"仪式与信仰需要用长期田野材料检验：同一套象征在不同场合承担不同的社会功能。",
         links:[{to:"turner-symbols", type:"agree", note:"与特纳一样关注象征的多义性与情境性。"}]}
      ]
    },
    {
      id:"fortes", name:"迈耶·福特斯", en:"Meyer Fortes",
      born:1906, died:1983, country:"英国", period:"struct",
      branches:["kinship","political"], regions:["加纳","塔伦西人"],
      tags:["世系理论","非洲政治体系"],
      summary:"与埃文斯-普里查德共同主编《非洲政治体系》，以塔伦西人的世系研究确立“世系理论”的典范，展示亲属结构如何承载政治与宗教功能。",
      statements:[
        {id:"fortes-politics", key:true, year:1940, branch:"political", work:"《非洲政治体系》（与埃文斯-普里查德合编）",
         text:"没有中央权力与法庭的社会，依然拥有可分析的政治秩序与制裁机制。",
         links:[{to:"evans-pritchard-nuer", type:"agree", note:"把无国家社会的政治秩序确立为比较研究的对象。"}]},
        {id:"fortes-tallensi", year:1949, branch:"kinship", work:"《塔伦西人的亲属网络》",
         text:"世系结构是塔伦西人政治与宗教生活的基本框架：亲属关系即社会秩序。",
         links:[{to:"radcliffe-brown-structure", type:"agree", note:"世系理论的结构功能主义典范案例。"}]},
        {id:"fortes-descent", year:1953, branch:"kinship", work:"《单系世系群的结构》",
         text:"世系群理论：单系继嗣把亲属关系组织成具有法人性质的政治单元，无须国家即可维持秩序。",
         links:[
           {to:"fortes-politics", type:"agree", note:"为“无国家社会”的政治秩序提供亲属制度上的解释。"},
           {to:"schneider-critique", type:"disagree", note:"施奈德后来质疑：世系群模型是对非洲材料的过度形式化。"}
         ]},
        {id:"fortes-ancestors", key:true, year:1959, branch:"religion", work:"《西非宗教中的俄狄浦斯与约伯》",
         text:"祖先崇拜把家族内部的权威与情感矛盾转化为道德秩序：宗教同时处理权力与命运问题。",
         links:[
           {to:"turner-ritual", type:"agree", note:"与特纳同样把仪式放在社会冲突的解决过程中理解。"},
           {to:"fortes-tallensi", type:"agree", note:"塔伦西研究的理论收束。"}
         ]}
      ]
    },
    {
      id:"bateson", name:"格雷戈里·贝特森", en:"Gregory Bateson",
      born:1904, died:1980, country:"英国", period:"struct",
      branches:["mind","language"], regions:["新几内亚","巴厘岛"],
      tags:["分裂生成","沟通理论","控制论"],
      summary:"跨越人类学、精神病学与控制论的思想家。他研究文化接触中的行为放大机制，并与米德合作拍摄巴厘岛的文化行为。",
      statements:[
        {id:"bateson-schismogenesis", key:true, year:1936, branch:"mind", work:"《纳文》",
         text:"“分裂生成”：文化接触中的行为会相互放大，仪式性的性别反转用于平衡这种螺旋。",
         links:[{to:"gluckman-rebellion", type:"agree", note:"对冲突与过程的共同关注。"}]},
        {id:"bateson-bali", year:1942, branch:"mind", work:"《巴厘岛人的性格》（与米德合著）",
         text:"用摄影与影像系统记录文化行为，探索“文化与人格”的经验研究方式。",
         links:[{to:"mead-samoa", type:"agree", note:"与米德共同推进文化与人格研究。"}]},
        {id:"bateson-mind", year:1972, branch:"language", work:"《走向心灵生态学》",
         text:"信息与关系模式（元沟通、双重束缚）比内容更根本，人类学应研究沟通系统。",
         links:[{to:"sapir-culture", type:"agree", note:"语言—沟通取向的延伸。"}]},
        {id:"bateson-double-bind", key:true, year:1956, branch:"mind", work:"《走向精神分裂症的理论》",
         text:"双重束缚：当沟通的层级相互矛盾且无法逃离时，个体只能以症状回应；精神症状应放在关系系统中理解。",
         links:[
           {to:"bateson-schismogenesis", type:"agree", note:"把互动过程的思路从部落社会延伸到家庭与临床。"},
           {to:"kleinman-models", type:"agree", note:"共同点：症状的意义必须放在关系与情境中解读。"}
         ]},
        {id:"bateson-mind-nature", year:1979, branch:"mind", work:"《心灵与自然》",
         text:"“差异即信息”：心灵不是头脑内部的实体，而是系统与环境之间循环的关系模式。",
         links:[
           {to:"bateson-mind", type:"agree", note:"《走向心灵生态学》的哲学总结。"},
           {to:"kohn-forest", type:"agree", note:"科恩把“心灵”扩展到森林的思考，直接继承这一命题。"}
         ]}
      ]
    },
    {
      id:"levy-strauss", name:"克洛德·列维-斯特劳斯", en:"Claude Lévi-Strauss",
      born:1908, died:2009, country:"法国", period:"struct",
      branches:["theory","kinship","religion","mind"], regions:["巴西","亚马逊"],
      tags:["结构主义","联盟理论","野性思维","神话学"],
      summary:"结构主义人类学的创立者。他把亲属、神话与分类系统视为心智无意识结构的变换，其影响远远超出人类学，波及整个人文社会科学。",
      statements:[
        {id:"levy-strauss-alliance", key:true, year:1949, branch:"kinship", work:"《亲属制度的基本结构》",
         text:"亲属制度是交换系统：乱伦禁忌迫使群体通过婚姻交换建立联盟。",
         links:[{to:"mauss-gift", type:"agree", note:"把礼物交换理论改写为婚姻联盟的结构理论。"}]},
        {id:"levy-strauss-tristes", year:1955, branch:"theory", work:"《忧郁的热带》",
         text:"民族志书写本身是“西方与它者”关系的一部分：旅行、观察与写作都需要自省。",
         links:[]},
        {id:"levy-strauss-savage", key:true, year:1962, branch:"theory", work:"《野性思维》",
         text:"具体性思维与科学思维并行；“拼贴匠”用手边的符号材料组装出意义秩序。",
         links:[{to:"geertz-interpretation", type:"disagree", note:"解释取向与结构取向之争：意义之网 vs 无意识结构。"}]},
        {id:"levy-strauss-myth", key:true, year:1964, branch:"religion", work:"《神话学：生食与熟食》",
         text:"神话的意义来自神话素之间的对立与变换规则，而非叙事内容本身。",
         links:[{to:"turner-symbols", type:"disagree", note:"特纳强调象征的过程与经验，反对静态的结构演绎。"}]},
        {id:"levy-strauss-race", year:1952, branch:"global", work:"《种族与历史》",
         text:"文化多样性不应被单线进化排序；“进步”是站在西方视角上的错觉。",
         links:[{to:"montagu-myth", type:"agree", note:"战后反种族主义的科学宣言之一。"}]},
        {id:"levy-strauss-structural-anth", year:1958, branch:"theory", work:"《结构人类学》",
         text:"结构分析的目标不是内容而是关系：制度、神话与亲属称谓都应被读作可替换项之间的结构变换。",
         links:[{to:"levy-strauss-myth", type:"agree", note:"把神话分析的方法论前提系统化。"}]},
        {id:"levy-strauss-totemism", year:1962, branch:"religion", work:"《图腾制度》",
         text:"图腾不是对动植物的崇拜，而是把自然类别与社会类别对应起来的分类逻辑。",
         links:[{to:"durkheim-elementary", type:"agree", note:"接续涂尔干的分类社会学，但改写为心智结构问题。"}]}
      ]
    },
    {
      id:"leach", name:"埃德蒙·利奇", en:"Edmund Leach",
      born:1910, died:1989, country:"英国", period:"struct",
      branches:["political","theory"], regions:["缅甸克钦","斯里兰卡"],
      tags:["政治人类学","过程分析","结构批判"],
      summary:"结构功能主义最有力的内部批评者。他以缅甸克钦人的研究说明社会秩序在两种理想型之间摇摆，结构不是稳定均衡而是历史过程。",
      statements:[
        {id:"leach-burma", key:true, year:1954, branch:"political", work:"《缅甸高地的政治制度》",
         text:"克钦社会在贡萨与贡劳两种秩序之间摆动：均衡是过程，不是稳定结构。",
         links:[{to:"radcliffe-brown-joking", type:"disagree", note:"反对把结构设想为自我平衡的稳定系统。"}]},
        {id:"leach-rethink", key:true, year:1961, branch:"theory", work:"《重新思考人类学》",
         text:"人类学概念是断裂的：婚姻、亲属等范畴在跨文化转译中必须重新定义。",
         links:[{to:"levy-strauss-myth", type:"agree", note:"接受结构分析，但要求加入历史与过程。"}]},
        {id:"leach-pul-eliya", year:1961, branch:"economic", work:"《普尔埃利亚：锡兰村庄研究》",
         text:"干旱区的水利与土地制度把亲属、等级与经济关系编织在一起；村庄不是自足的共同体而是关系网络中的节点。",
         links:[{to:"leach-burma", type:"agree", note:"与克钦研究一致：把村落放回更大的政治经济网络中理解。"}]},
        {id:"leach-genesis", year:1969, branch:"religion", work:"《创世记作为神话》",
         text:"《圣经》叙事与“原始”神话可用同一套结构方法阅读：神圣文本同样依赖对立的转换。",
         links:[{to:"levy-strauss-myth", type:"agree", note:"把结构主义神话分析应用于西方经典，是其最锋利的一次示范。"}]}
      ]
    },
    {
      id:"gluckman", name:"马克斯·格拉克曼", en:"Max Gluckman",
      born:1911, died:1975, country:"英国（南非出生）", period:"struct",
      branches:["political","religion"], regions:["南非","赞比亚","罗齐人"],
      tags:["曼彻斯特学派","反叛仪式","法律过程"],
      summary:"曼彻斯特学派的创始人。他强调冲突是社会的常态，仪式与法律把冲突纳入可控秩序，由此开启过程取向的政治人类学。",
      statements:[
        {id:"gluckman-rebellion", key:true, year:1954, branch:"religion", work:"《东南非洲的反叛仪式》",
         text:"反叛仪式：仪式性地表达对权力的不满，反而强化了既有秩序。",
         links:[{to:"radcliffe-brown-function", type:"disagree", note:"以冲突视角修正均衡功能主义。"}]},
        {id:"gluckman-judicial", year:1955, branch:"political", work:"《巴罗策人的司法过程》",
         text:"法律是社会冲突的常规化处理过程，而不是一套静态的规范条文。",
         links:[{to:"malinowski-crime", type:"agree", note:"把互惠与制裁问题推进到法庭过程研究。"}]},
        {id:"gluckman-situational", key:true, year:1940, branch:"theory", work:"《现代祖鲁兰一个社会情境的分析》",
         text:"情境分析（扩展个案法）：从一次桥梁开通仪式出发，逐层展开部落、殖民行政与城市社会的多重场域。",
         links:[
           {to:"gluckman-conflict", type:"agree", note:"把冲突与整合的分析方法延伸到殖民现代情境。"},
           {to:"marcus-multisited", type:"agree", note:"被视为多地点民族志与全球情境分析的方法论先驱。"},
           {to:"malinowski-method", type:"disagree", note:"反对把“一个部落一个民族志”的封闭单元当作默认对象。"}
         ]},
        {id:"gluckman-conflict", year:1963, branch:"political", work:"《部落社会的秩序与反叛》",
         text:"冲突不是社会解体前的失序，而是被制度化的组成部分；秩序通过冲突的表达与解决得以维持。",
         links:[{to:"gluckman-rebellion", type:"agree", note:"《反叛仪式》命题的完整表述。"}]}
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
        {id:"turner-symbols", key:true, year:1967, branch:"religion", work:"《象征的森林》",
         text:"象征是多义的：每个象征浓缩多重意义，同时作用于情感与规范。",
         links:[{to:"geertz-deep", type:"agree", note:"与格尔茨的象征—意义分析并肩而立。"}]},
        {id:"turner-communitas", key:true, year:1969, branch:"religion", work:"《仪式过程》",
         text:"阈限与交融：仪式的过渡阶段产生短暂的平等共同体（communitas），反照结构本身。",
         links:[{to:"durkheim-elementary", type:"agree", note:"“集体欢腾”的仪式过程版本。"}]},
        {id:"turner-social-drama", year:1974, branch:"theory", work:"《戏剧、场域与隐喻》",
         text:"社会戏剧四阶段： breach—危机—补救—重组（或分裂）；过程而非均衡才是社会生活的常态。",
         links:[
           {to:"turner-ritual", type:"agree", note:"把仪式过程的分析扩展为一般的社会过程理论。"},
           {to:"gluckman-conflict", type:"agree", note:"继承并系统化格拉克曼的冲突论。"}
         ]},
        {id:"turner-pilgrimage", year:1978, branch:"religion", work:"《基督教文化中的图像与朝圣》",
         text:"朝圣是阈限过程的空间化：在圣地，世俗身份被悬置，共同体感被重新体验。",
         links:[{to:"turner-communitas", type:"agree", note:"把 communitas 从部落仪式推向世界宗教与现代社会。"}]}
      ]
    },
    {
      id:"douglas", name:"玛丽·道格拉斯", en:"Mary Douglas",
      born:1921, died:2007, country:"英国", period:"interp",
      branches:["religion","theory"], regions:["刚果","伦敦"],
      tags:["洁净与危险","分类","格群分析"],
      summary:"象征人类学与分类研究的代表。她提出“污秽即错位之物”，把禁忌解释为分类系统的越界，并以“群体/网格”框架分析社会结构与象征形式的关系。",
      statements:[
        {id:"douglas-purity", key:true, year:1966, branch:"religion", work:"《洁净与危险》",
         text:"污秽不是物质的不洁，而是分类的越界——“错位之物”（matter out of place）。",
         links:[{to:"turner-communitas", type:"agree", note:"把阈限与分类的洞见推进到污染与禁忌研究。"}]},
        {id:"douglas-grid", key:true, year:1970, branch:"theory", work:"《自然的象征》",
         text:"群体与网格：社会结构的两个维度可以预测仪式与象征的形态。",
         links:[
           {to:"durkheim-elementary", type:"agree", note:"社会形态与分类形式相关联。"},
           {to:"levy-strauss-savage", type:"agree", note:"把结构分类分析用于日常与仪式生活。"}
         ]},
        {id:"douglas-risk", year:1982, branch:"global", work:"《风险与文化》",
         text:"风险感知是文化选择：一个社会选择警惕什么，取决于它的社会结构与道德边界。",
         links:[{to:"douglas-purity", type:"agree", note:"污染与危险的分类逻辑被应用于现代环境与健康争议。"}]},
        {id:"douglas-institutions", year:1986, branch:"theory", work:"《制度如何思考》",
         text:"制度不是被思考的对象，而是思考的条件：制度通过分类、类比与记忆塑造个体认知。",
         links:[
           {to:"douglas-grid", type:"agree", note:"“网格/群体”分析框架的认知论延伸。"},
           {to:"bourdieu-habitus", type:"agree", note:"与布迪厄一样强调分类图式由社会关系生成。"}
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
        {id:"geertz-interpretation", key:true, year:1973, branch:"theory", work:"《文化的解释》",
         text:"深描：民族志的任务是记录意义的层级结构，而不是提炼行为规律。",
         links:[{to:"malinowski-method", type:"disagree", note:"参与观察之外仍需解释：从“在那里”到“写下它”。"}]},
        {id:"geertz-deep", key:true, year:1973, branch:"religion", work:"《深层游戏：巴厘岛的斗鸡》",
         text:"巴厘斗鸡是一段文本：文化通过公共象征展示地位焦虑与声望竞争。",
         links:[]},
        {id:"geertz-involution", year:1963, branch:"economic", work:"《农业内卷化》",
         text:"内卷化：爪哇农业以劳动力填充换来增长，却没有发展。",
         links:[]},
        {id:"geertz-religion", key:true, year:1973, branch:"religion", work:"《作为文化系统的宗教》",
         text:"宗教是文化系统：它通过象征在情绪与动机之间建立秩序。",
         links:[{to:"asad-genealogy", type:"disagree", note:"阿萨德批评：把宗教定义为象征系统，忽视了权力与历史。"}]},
        {id:"geertz-negara", year:1980, branch:"political", work:"《尼加拉：十九世纪巴厘剧场国家》",
         text:"剧场国家：仪式不是权力的装饰，而是权力本身；政治以表演实现秩序。",
         links:[{to:"wolf-history", type:"disagree", note:"政治经济学视角补充：仪式国家同样被卷入贸易与殖民体系。"}]},
        {id:"geertz-local-knowledge", year:1983, branch:"theory", work:"《地方知识》",
         text:"人类学的贡献不是发现普遍法则，而是训练“转换”的能力：在他人与自己的意义系统之间来回翻译。",
         links:[
           {to:"geertz-interpretation", type:"agree", note:"解释人类学的元理论表述。"},
           {to:"levy-strauss-savage", type:"disagree", note:"再次与结构主义分野：比较的目标不是结构法则而是可比性本身。"}
         ]},
        {id:"geertz-works-lives", year:1988, branch:"theory", work:"《著作与生活》",
         text:"民族志作者在文本中建构自己的形象（“我曾在场”）；人类学写作的修辞值得被当作研究对象。",
         links:[{to:"clifford-authority", type:"agree", note:"与《写文化》共同构成对民族志权威的反思。"}]}
      ]
    },
    {
      id:"dumont", name:"路易·杜蒙", en:"Louis Dumont",
      born:1911, died:1998, country:"法国", period:"interp",
      branches:["kinship","political","religion"], regions:["南印度","法国"],
      tags:["种姓制度","等级","整体主义与个人主义"],
      summary:"印度研究大家。他以洁净/污染的等级整体解释种姓制度，并指出“个人主义”是西方特有的意识形态，必须被人类学对象化。",
      statements:[
        {id:"dumont-homo", key:true, year:1966, branch:"kinship", work:"《阶序人》",
         text:"种姓制度以洁净/污染的等级整合社会，必须作为一个等级整体来理解。",
         links:[{to:"levy-strauss-alliance", type:"agree", note:"把结构方法用于等级整体的分析。"}]},
        {id:"dumont-ideology", year:1966, branch:"political", work:"《阶序人》",
         text:"现代意识形态把个人当作价值的终极承载者；人类学必须反思这一本土范畴。",
         links:[]},
        {id:"dumont-individualism", key:true, year:1983, branch:"theory", work:"《论个体主义》",
         text:"“个体主义”是现代西方的意识形态：把个人当作最高价值是一种历史产物，而非普遍真理。",
         links:[
           {to:"dumont-homo", type:"agree", note:"阶序研究的对称命题：整体主义与个体主义是两种意识形态。第一版《阶序人》早于本书。"},
           {to:"mauss-person", type:"agree", note:"直接继承莫斯关于“人”的范畴史。"}
         ]}
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
        {id:"sahlins-affluent", key:true, year:1972, branch:"economic", work:"《石器时代经济学》",
         text:"原初丰裕社会：狩猎采集者需求有限、手段充足，稀缺是被制造的假设。",
         links:[]},
        {id:"sahlins-practical-reason", year:1976, branch:"theory", work:"《文化与实践理性》",
         text:"文化与实践理性：人的需要与利益由文化范畴中介，功利解释无法穷尽社会再生产。",
         links:[{to:"harris-materialism", type:"disagree", note:"文化范畴 vs 生态—功利因果，两种解释纲领的对峙。"}]},
        {id:"sahlins-islands", key:true, year:1985, branch:"global", work:"《历史之岛》",
         text:"结构与历史：夏威夷人把库克船长的到来纳入神话图式，事件以文化结构的方式被理解。",
         links:[
           {to:"wolf-history", type:"agree", note:"把全球遭遇纳入文化与结构的分析。"},
           {to:"levy-strauss-myth", type:"agree", note:"把静态的结构概念动态化、历史化。"}
         ]},
        {id:"sahlins-historical-metaphors", year:1981, branch:"theory", work:"《历史隐喻与神话现实》",
         text:"结构与事件相互生成：夏威夷人把库克船长纳入既有神话范畴，结果改写了他们自己的结构。",
         links:[
           {to:"sahlins-islands", type:"agree", note:"“历史之岛”命题的首次系统表述。"},
           {to:"obeyesekere-cook", type:"disagree", note:"奥贝耶塞克雷反对库克被神化的说法，争论的正是“他者的范畴能否被这样翻译”。"}
         ]},
        {id:"sahlins-kinship", year:2013, branch:"kinship", work:"《亲属关系是什么，不是什么》",
         text:"亲属关系不是生物血统的编码，而是“存在的相互性”：把人当作同一存在的组成部分。",
         links:[
           {to:"schneider-critique", type:"agree", note:"接受施奈德对生物决定论的批判，但主张亲属研究不应因此被放弃。"},
           {to:"strathern-gift", type:"agree", note:"与斯特拉森一样把亲属理解为关系性的存在方式。"}
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
        {id:"wolf-history", key:true, year:1982, branch:"global", work:"《欧洲与没有历史的人民》",
         text:"“没有历史的人民”并非没有历史，而是被资本主义扩张卷入并重写。",
         links:[]},
        {id:"wolf-power", year:1982, branch:"political", work:"《欧洲与没有历史的人民》",
         text:"文化是权力关系中的建构与斗争，而不是和谐统一的整体。",
         links:[{to:"asad-encounter", type:"agree", note:"与人类学殖民权力反思同调。"}]},
        {id:"wolf-peasant-wars", year:1969, branch:"political", work:"《二十世纪的农民战争》",
         text:"农民起义的条件不在“农民性格”，而在土地、租佃与殖民卷入所构成的中间层结构。",
         links:[{to:"wolf-power", type:"agree", note:"把结构性分析从社区扩展到全球政治经济。"}]},
        {id:"wolf-envisioning", key:true, year:1999, branch:"political", work:"《展望权力》",
         text:"三种权力：人际权力、组织权力，以及使某些问题根本无从提出的“结构权力”。",
         links:[
           {to:"wolf-history", type:"agree", note:"结构性权力的概念是“没有历史的人民”的理论总结。"},
           {to:"trouillot-silencing", type:"agree", note:"与特鲁约一样关注权力如何决定什么能被说出。"}
         ]}
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
        {id:"mintz-sugar", key:true, year:1985, branch:"economic", work:"《甜与权力》",
         text:"糖的历史显示殖民贸易如何塑造日常消费与意义：甜味是权力的味道。",
         links:[{to:"wolf-history", type:"agree", note:"政治经济与文化的交汇研究。"}]},
        {id:"mintz-commodity", year:1985, branch:"global", work:"《甜与权力》",
         text:"商品在成为日用品之前的漫长旅程，是政治经济与意义生产的交汇点。",
         links:[{to:"appadurai-things", type:"agree", note:"与“物的社会生命”研究相互呼应。"}]},
        {id:"mintz-caribbean", key:true, year:1974, branch:"economic", work:"《加勒比变形记》",
         text:"加勒比社会是种植园经济与殖民体系的产物；“传统”社会同样是现代世界体系的历史成果。",
         links:[
           {to:"mintz-sugar", type:"agree", note:"《甜与权力》分析框架的前身。"},
           {to:"wolf-history", type:"agree", note:"与沃尔夫同属“把地方社会放进世界历史”的取向。"}
         ]},
        {id:"mintz-afro-american", year:1976, branch:"global", work:"《非裔美洲文化的诞生》",
         text:"非裔美洲文化不是非洲残余的拼贴，而是在奴役条件下持续的创造与再造。",
         links:[{to:"mintz-worker", type:"agree", note:"把甘蔗工人研究的立场推广到文化形成问题。"}]}
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
        {id:"harris-materialism", key:true, year:1979, branch:"theory", work:"《文化唯物主义》",
         text:"技术—环境—生产的条件（基础设施）塑造社会结构与观念（上层建筑）。",
         links:[]},
        {id:"harris-cows", key:true, year:1974, branch:"religion", work:"《牛、猪、战争与女巫》",
         text:"印度牛的神圣性有其生态—经济理性：保护役畜是长期的生存策略。",
         links:[{to:"douglas-purity", type:"disagree", note:"禁忌是分类逻辑还是生态理性？象征解释与功能解释的冲突。"}]},
        {id:"harris-sacred-cattle", year:1966, branch:"economic", work:"《印度圣牛的文化生态学》",
         text:"圣牛禁忌并非非理性：在农业—畜牧混作系统中，牛的经济与生态价值解释了禁忌的功能。",
         links:[
           {to:"harris-materialism", type:"agree", note:"文化唯物主义的经典案例。"},
           {to:"sahlins-practical-reason", type:"disagree", note:"萨林斯批评：把文化化约为生态效益，抹掉了文化范畴自身的逻辑。"}
         ]},
        {id:"harris-cannibals", year:1977, branch:"economic", work:"《食人族与国王》",
         text:"文化的演化由人口压力与生产条件驱动：从狩猎到灌溉，从蛋白质短缺到国家起源。",
         links:[{to:"harris-materialism", type:"agree", note:"面向大众的理论普及版。"}]}
      ]
    },
    {
      id:"schneider", name:"大卫·施奈德", en:"David M. Schneider",
      born:1918, died:1995, country:"美国", period:"interp",
      branches:["kinship"], regions:["芝加哥","美国"],
      tags:["亲属研究批判","文化象征系统"],
      summary:"以摧毁自身研究领域而闻名的学者。他指出亲属研究建立在西方“血缘即生物事实”的假设上，最终宣告传统亲属研究的终结。",
      statements:[
        {id:"schneider-american", key:true, year:1968, branch:"kinship", work:"《美国亲属：一种文化说明》",
         text:"美国的亲属是一套文化象征系统：血缘、婚姻与规范意义都由文化定义。",
         links:[{to:"radcliffe-brown-structure", type:"disagree", note:"动摇世系理论把生物谱系当作社会事实的假设。"}]},
        {id:"schneider-critique", key:true, year:1984, branch:"kinship", work:"《对亲属研究的批判》",
         text:"“亲属”是西方的本土范畴；将它投射到其他社会，必须接受彻底批判。",
         links:[{to:"levy-strauss-alliance", type:"disagree", note:"联盟理论与世系理论共享了生物基础的假设。"}]},
        {id:"schneider-blood-law", year:1968, branch:"kinship", work:"《美国亲属：一种文化说明》",
         text:"“血缘”与“姻亲”是欧美民间观念，却被当成亲属关系的普遍定义：人类学的“亲属”概念本身需要被对象化。",
         links:[
           {to:"schneider-critique", type:"agree", note:"16 年后把这一批判推向要求重建整个亲属研究。"},
           {to:"sahlins-kinship", type:"disagree", note:"萨林斯认为施奈德的批判走得太远，亲属关系的比较研究仍可能。"}
         ]}
      ]
    },
    {
      id:"bourdieu", name:"皮埃尔·布迪厄", en:"Pierre Bourdieu",
      born:1930, died:2002, country:"法国", period:"interp",
      branches:["theory"], regions:["阿尔及利亚","法国"],
      tags:["实践理论","习性","文化再生产"],
      summary:"从卡比尔人的田野研究走向社会实践理论的大家。他以“习性”“资本”“场域”解释实践如何既被结构塑造又不断生成结构。",
      statements:[
        {id:"bourdieu-habitus", key:true, year:1972, branch:"theory", work:"《实践理论大纲》",
         text:"实践理论：习性是被结构化的生成原则，行动既不是规则遵循，也不是功利计算。",
         links:[{to:"levy-strauss-savage", type:"disagree", note:"反对把实践还原为无意识结构或规则系统。"}]},
        {id:"bourdieu-distinction", key:true, year:1979, branch:"theory", work:"《区分》",
         text:"趣味即阶级标记：文化消费的差异再生产着社会区隔。",
         links:[]},
        {id:"bourdieu-reproduction", year:1970, branch:"theory", work:"《再生产》",
         text:"教育系统以“中立”的方式再生产阶级结构；文化资本使社会继承获得合法性外观。",
         links:[
           {to:"bourdieu-distinction", type:"agree", note:"《区分》提供经验证据，本书提供理论装置。"},
           {to:"willis-learning", type:"agree", note:"威利斯《学做工》把这一命题带入民族志与学校现场。"}
         ]},
        {id:"bourdieu-sense", year:1980, branch:"theory", work:"《实践感》",
         text:"礼物交换的节奏、身体的习惯姿态：实践知识是身体化的、时间性的，不能被还原为规则。",
         links:[
           {to:"mauss-gift", type:"agree", note:"把礼物交换的分析推进到实践的时间结构。"},
           {to:"bourdieu-habitus", type:"agree", note:"习性的完整理论表述。"}
         ]},
        {id:"bourdieu-masculine", year:1998, branch:"mind", work:"《男性统治》",
         text:"象征暴力：支配关系因为被视为自然（甚至被支配者也被卷入承认）而不被认出为暴力。",
         links:[
           {to:"rubin-traffic", type:"agree", note:"与女性主义人类学在性别支配问题上相互参照。"},
           {to:"abu-poetry", type:"agree", note:"两者都关心支配如何被体验、被言语化。"}
         ]}
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
        {id:"rubin-traffic", key:true, year:1975, branch:"mind", work:"《女人交易》",
         text:"性/性别制度：用交换与再生产理论分析女性如何被制度性地安排。",
         links:[{to:"levy-strauss-alliance", type:"agree", note:"借用婚姻交换理论，同时从女性主义立场加以批判。"}]},
        {id:"rubin-sex", key:true, year:1984, branch:"mind", work:"《思考性》",
         text:"性的政治：性规范不断生产“正常”与“越界”，需要独立的批判框架。",
         links:[]},
        {id:"rubin-charmed-circle", year:1984, branch:"mind", work:"《思考性》",
         text:"“魅力圈”与性等级：性实践被分为可接受与不可接受，性分层本身是一种道德政治。",
         links:[
           {to:"rubin-sex", type:"agree", note:"《思考性》的另一半论证：性如何被分级。"},
           {to:"newton-mother-camp", type:"agree", note:"与牛顿一样把性少数与“越轨”社群当作严肃的民族志对象。"}
         ]},
        {id:"rubin-deviations", year:2011, branch:"mind", work:"《偏差：读本》",
         text:"性社群也需要民族志：旧金山的皮革与性少数社群有自己的历史、等级与仪式，不是“偏差”的注脚。",
         links:[{to:"newton-mother-camp", type:"agree", note:"与牛顿一样把性少数社群当作严肃的民族志对象。"}]}
      ]
    },
    {
      id:"ortner", name:"谢里·奥特纳", en:"Sherry Ortner",
      born:1941, died:null, country:"美国", period:"interp",
      branches:["mind","theory"], regions:["尼泊尔","夏威夷"],
      tags:["女性主义人类学","实践论","自然/文化"],
      summary:"女性主义人类学与实践论转向的代表人物。她既追问“女性为何普遍被贬值”，也系统总结了六十年代以来人类学从结构走向能动性的理论变迁。",
      statements:[
        {id:"ortner-nature", key:true, year:1974, branch:"mind", work:"《女性之于男性是否如同自然之于文化？》",
         text:"女性被置于“自然”一侧而男性被置于“文化”一侧，这是文化建构的象征秩序，而非天性。",
         links:[{to:"mead-gender", type:"agree", note:"性别气质的文化建构这一命题的延续与深化。"}]},
        {id:"ortner-practice", key:true, year:1984, branch:"theory", work:"《六十年代以来的人类学理论》",
         text:"实践论转向：人类学从结构转向能动性、历史与权力。",
         links:[{to:"bourdieu-habitus", type:"agree", note:"实践理论的美国式综合与传播。"}]},
        {id:"ortner-sherpas", year:1978, branch:"religion", work:"《夏尔巴人的仪式》",
         text:"仪式是权威与等级的戏剧化：夏尔巴佛教仪式把社会秩序呈现为宇宙秩序。",
         links:[{to:"turner-symbols", type:"agree", note:"象征分析在喜马拉雅佛教社会的应用。"}]},
        {id:"ortner-everest", year:1999, branch:"global", work:"《珠峰上的生与死》",
         text:"登山资本主义重塑了夏尔巴社会：声望、风险与阶层在“严肃游戏”中重新分配。",
         links:[
           {to:"ortner-practice", type:"agree", note:"实践理论的完整运用：结构、能动性与历史变迁。"}
         ]},
        {id:"ortner-subjectivity", year:2005, branch:"mind", work:"《主体性与文化批判》",
         text:"主体性既被文化塑造，也是批判与抵抗的资源：它应当成为人类学的核心问题。",
         links:[
           {to:"rosaldo-self", type:"agree", note:"与罗萨尔多关于自我与情感的人类学主张相呼应。"},
           {to:"luhrmann-mind", type:"agree", note:"都为“内在生活如何被文化塑造”提供了纲领。"}
         ]}
      ]
    },
    {
      id:"rosaldo-m", name:"米歇尔·罗萨尔多", en:"Michelle Z. Rosaldo",
      born:1944, died:1981, country:"美国", period:"interp",
      branches:["mind","political"], regions:["菲律宾","伊隆戈人"],
      tags:["情感人类学","女性主义","猎头"],
      summary:"情感人类学的先行者。她研究伊隆戈人的猎头与情感如何连接自我与政治，并反思女性主义人类学自身的分析范畴。",
      statements:[
        {id:"rosaldo-passion", key:true, year:1980, branch:"mind", work:"《知识与激情》",
         text:"伊隆戈人的猎头与情感：愤怒与知识通过情感话语把自我与社会连在一起。",
         links:[{to:"geertz-deep", type:"agree", note:"把意义分析推进到情感与身体经验。"}]},
        {id:"rosaldo-feminism", year:1980, branch:"political", work:"《人类学的用途与滥用》",
         text:"女性主义人类学必须反思学科自身的分析范畴，而不是套用普遍化的性别模型。",
         links:[{to:"rubin-traffic", type:"agree", note:"性别范畴的批判性重构。"}]},
        {id:"rosaldo-woman-culture", key:true, year:1974, branch:"mind", work:"《女人、文化与社会》（合编）",
         text:"性别不平等并非普遍必然：把女性置于分析中心，会改写人类学关于社会结构的整套问题。",
         links:[
           {to:"ortner-nature", type:"agree", note:"与奥特纳的《自然/文化》同属女性主义人类学的奠基文本。"},
           {to:"rubin-traffic", type:"agree", note:"与鲁宾同期推动“性别”成为独立分析范畴。"}
         ]},
        {id:"rosaldo-self", year:1984, branch:"mind", work:"《迈向自我与情感的人类学》",
         text:"情感不是内在驱力，而是文化实践：它需要被当作社会关系的一部分来分析。",
         links:[
           {to:"rosaldo-passion", type:"agree", note:"把《知识与激情》的伊隆戈材料提升为方法论主张。"},
           {to:"abu-poetry", type:"agree", note:"与阿布-卢戈德一样把情感与诗性语言当作社会分析的对象。"}
         ]}
      ]
    },
    {
      id:"taussig", name:"迈克尔·陶西格", en:"Michael Taussig",
      born:1940, died:null, country:"澳大利亚 / 美国", period:"interp",
      branches:["economic","theory"], regions:["哥伦比亚","南美"],
      tags:["商品拜物教","魔鬼","模仿"],
      summary:"以诗性与实验文风著称的人类学家。他研究矿区农民如何用魔鬼信仰理解资本主义交换的暴力，并把“模仿”发展为权力分析的概念。",
      statements:[
        {id:"taussig-devil", key:true, year:1980, branch:"economic", work:"《魔鬼与商品拜物教》",
         text:"矿区农民的魔鬼信仰，是对资本主义交换之暴力的一种寓意式解释。",
         links:[{to:"mintz-sugar", type:"agree", note:"政治经济与意义分析的结合。"}]},
        {id:"taussig-mimesis", year:1993, branch:"theory", work:"《模仿与他者》",
         text:"模仿：模仿他者是身体与权力的政治，殖民恐惧透过复制与变形流通。",
         links:[]},
        {id:"taussig-shamanism", key:true, year:1987, branch:"religion", work:"《萨满教、殖民主义与野人》",
         text:"殖民恐怖与印第安治疗是同一片地形的两面：被压迫者在萨满仪式中重演并挪用暴力。",
         links:[
           {to:"taussig-devil", type:"agree", note:"把哥伦比亚种植园研究的主题推进到殖民史与治疗。"},
           {to:"stoler-intimacies", type:"agree", note:"与斯托勒一样把殖民暴力放回亲密关系与日常治理中考察。"}
         ]},
        {id:"taussig-defacement", year:1999, branch:"political", work:"《去面》",
         text:"“公共秘密”：国家恐怖之所以有效，恰恰因为人人都知道它，却无人能说它。",
         links:[
           {to:"taussig-mimesis", type:"agree", note:"模仿与暴力在公共秘密中的结合。"},
           {to:"das-violence", type:"agree", note:"与达斯关于暴力与沉默的研究相互呼应。"}
         ]}
      ]
    },
    {
      id:"fabian", name:"约翰内斯·法比安", en:"Johannes Fabian",
      born:1937, died:2016, country:"德国 / 美国", period:"contemp",
      branches:["theory","global"], regions:["刚果","荷兰"],
      tags:["同代性","时间政治","反思人类学"],
      summary:"以《时间与他者》质疑人类学的认识论前提：把研究对象安放在“过去”，正是殖民权力的时间政治。",
      statements:[
        {id:"fabian-time", key:true, year:1983, branch:"theory", work:"《时间与他者》",
         text:"同代性：人类学写作把研究对象置于“过去”，这种时间距离是殖民权力的认识论形式。",
         links:[{to:"asad-encounter", type:"agree", note:"与殖民权力反思一道，重审学科的知识形式。"}]},
        {id:"fabian-denial", key:true, year:1983, branch:"theory", work:"《时间与他者》",
         text:"“同代性的否认”（denial of coevalness）：人类学写作常把研究对象安置在另一种时间里，这是一种政治操作。",
         links:[
           {to:"fabian-time", type:"agree", note:"《时间与他者》的核心论证。"},
           {to:"asad-encounter", type:"agree", note:"与阿萨德一样把学科史放进殖民关系中重审。"},
           {to:"ep-nuer-time", type:"disagree", note:"对“他者的时间”这一经典描写方式的直接清算。"}
         ]},
        {id:"fabian-language", year:1986, branch:"language", work:"《语言与殖民权力》",
         text:"斯瓦希里语在德属东非的官定化：语言政策是殖民治理的工具，也是被殖民者争夺的资源。",
         links:[{to:"fabian-denial", type:"agree", note:"用档案材料把时间政治落到语言政治上。"}]}
      ]
    },
    {
      id:"asad", name:"塔拉勒·阿萨德", en:"Talal Asad",
      born:1932, died:null, country:"英国 / 美国", period:"contemp",
      branches:["global","religion","theory"], regions:["中东","苏丹"],
      tags:["殖民遭遇","宗教谱系","权力"],
      summary:"反思人类学与宗教研究的关键人物。他追问人类学知识生产的殖民条件，并批判把“宗教”当作普适范畴的定义方式。",
      statements:[
        {id:"asad-encounter", key:true, year:1973, branch:"global", work:"《人类学与殖民遭遇》",
         text:"人类学与殖民遭遇：学科的知识生产嵌入殖民权力关系，必须反思其政治条件。",
         links:[{to:"radcliffe-brown-function", type:"disagree", note:"“纯科学”的姿态掩盖了殖民处境。"}]},
        {id:"asad-genealogy", key:true, year:1993, branch:"religion", work:"《宗教的谱系》",
         text:"“宗教”是近代西方的范畴；将它普适化会遮蔽具体历史与权力关系。",
         links:[]},
        {id:"asad-islam", year:1986, branch:"religion", work:"《伊斯兰人类学的观念》",
         text:"不要把伊斯兰当作研究对象实体，而要把它当作一个由文本与实践构成、不断被争论的“话语传统”。",
         links:[
           {to:"asad-genealogy", type:"agree", note:"把《宗教的谱系》的立场落到具体宗教研究上。"},
           {to:"geertz-religion", type:"disagree", note:"批评“宗教作为文化系统”仍依赖西方基督教式的宗教范畴。"}
         ]},
        {id:"asad-secular", year:2003, branch:"global", work:"《世俗的形成》",
         text:"世俗主义不是宗教的消失，而是把宗教重新安置起来：它同时改造国家、身体与痛苦的表达。",
         links:[
           {to:"asad-islam", type:"agree", note:"从“宗教概念”扩展到“世俗概念”的谱系。"},
           {to:"asad-genealogy", type:"agree", note:"谱系方法从“宗教”概念延伸到“世俗”概念。"}
         ]}
      ]
    },
    {
      id:"clifford", name:"詹姆斯·克利福德", en:"James Clifford",
      born:1945, died:null, country:"美国", period:"contemp",
      branches:["theory","global"], regions:["美国","博物馆"],
      tags:["写文化","民族志权威","实验民族志"],
      summary:"反思民族志写作的代表人物。他与马尔库斯共同主编《写文化》，把民族志视为带有诗学与政治维度的写作实践。",
      statements:[
        {id:"clifford-authority", key:true, year:1983, branch:"theory", work:"《论民族志权威》",
         text:"民族志写作是诗学与政治：权威、修辞与叙事策略共同构造“我在此处”的证明。",
         links:[{to:"levy-strauss-tristes", type:"agree", note:"《忧郁的热带》被视为自反性写作的先声。"}]},
        {id:"clifford-predicament", key:true, year:1988, branch:"global", work:"《文化的困境》",
         text:"文化是挪用的技艺：民族志对象在收藏、展览与挪用中被不断重新定义。",
         links:[{to:"appadurai-things", type:"agree", note:"与“物的社会生命”研究在博物馆政治上相互呼应。"}]},
        {id:"clifford-salvage", year:1987, branch:"theory", work:"《超越“抢救”范式》",
         text:"“抢救式人类学”把对象设定为即将消失的过去；应当承认他者与现实同在，并与之共时地写作。",
         links:[
           {to:"fabian-denial", type:"agree", note:"反对把研究对象置于消失中的过去。"},
           {to:"clifford-predicament", type:"agree", note:"同样的批判立场在《文化的困境》中展开。"}
         ]},
        {id:"clifford-routes", year:1997, branch:"global", work:"《路线》",
         text:"文化不是固定地点上的东西：旅行、翻译与“接触地带”才是理解文化生产的位置。",
         links:[
           {to:"clifford-authority", type:"agree", note:"把写作权威的反思扩展为对“地点”本身的反思。"},
           {to:"marcus-multisited", type:"agree", note:"与多点民族志共同回应“文化在地化”的假设。"}
         ]}
      ]
    },
    {
      id:"marcus", name:"乔治·马尔库斯", en:"George E. Marcus",
      born:1946, died:null, country:"美国", period:"contemp",
      branches:["theory","global"], regions:["美国","汤加"],
      tags:["写文化","多地点民族志","自反性"],
      summary:"与克利福德共同推动“写文化”转向，并在此后提出多地点民族志，回应研究对象本身的世界体系分布。",
      statements:[
        {id:"marcus-multisited", key:true, year:1995, branch:"theory", work:"《世界体系中的民族志》",
         text:"多地点民族志：在多个场所之间追踪对象，才能呈现世界体系中的文化过程。",
         links:[{to:"clifford-authority", type:"agree", note:"实验民族志方法论的延伸。"}]},
        {id:"marcus-authority", key:true, year:1986, branch:"theory", work:"《写文化》（与克利福德合编）",
         text:"民族志权威本身就是争议场：再现他者要求新的自反性写作伦理。",
         links:[{to:"abu-writing", type:"agree", note:"与“书写反文化”的批判互为呼应。"}]},
        {id:"marcus-cultural-critique", year:1986, branch:"theory", work:"《作为文化批评的人类学》",
         text:"人类学应承担文化批评的职能：通过他者的对照使自身的常识“陌生化”。",
         links:[
           {to:"marcus-authority", type:"agree", note:"与《写文化》同期的纲领性表述。"},
           {to:"geertz-local-knowledge", type:"disagree", note:"批评解释人类学把批评的锋芒收回到文本与翻译之中。"}
         ]},
        {id:"marcus-contemporary", year:2008, branch:"theory", work:"《当代人类学的设计》",
         text:"“当代”本身需要方法设计：与实验科学、信息技术与政策实践共同工作，而不是研究已经成形的对象。",
         links:[{to:"marcus-multisited", type:"agree", note:"多点民族志之后的方法论续篇。"}]}
      ]
    },
    {
      id:"appadurai", name:"阿尔君·阿帕杜莱", en:"Arjun Appadurai",
      born:1949, died:null, country:"印度 / 美国", period:"contemp",
      branches:["global","economic"], regions:["印度","美国"],
      tags:["物的社会生命","全球化","景观"],
      summary:"全球化人类学最重要的理论家。他提出“物的社会生命”与全球文化流动的“景观”框架，重塑了我们对地方与全球关系的理解。",
      statements:[
        {id:"appadurai-things", key:true, year:1986, branch:"economic", work:"《物的社会生命》（主编）",
         text:"物品有社会生命：从礼物到商品的位置移动，揭示政治与意义的变迁。",
         links:[{to:"mauss-gift", type:"agree", note:"把礼物研究推进到“物的社会生命”与商品化问题。"}]},
        {id:"appadurai-global", key:true, year:1996, branch:"global", work:"《消散的现代性》",
         text:"全球化的五个景观（族裔、媒介、技术、金融、意识形态）重写了地方性的生产。",
         links:[{to:"wolf-history", type:"agree", note:"为全球体系研究加上文化的维度。"}]},
        {id:"appadurai-imagined", year:1996, branch:"global", work:"《消散的现代性》",
         text:"媒介与迁移创造了新的想象与认同方式，地方与全球彼此缠绕。",
         links:[]},
        {id:"appadurai-aspiration", year:2004, branch:"global", work:"《向往的能力》",
         text:"贫困研究需要关注“向往的能力”：穷人的愿望如何被文化规范与政治条件限制。",
         links:[{to:"appadurai-global", type:"agree", note:"把想象与愿望的分析带入发展研究。"}]},
        {id:"appadurai-future", year:2013, branch:"global", work:"《未来作为文化事实》",
         text:"未来是一种文化事实：可能性、失败与希望被不同的文化机制所组织。",
         links:[{to:"appadurai-imagined", type:"agree", note:"把“想象”的问题推向“未来”维度。"}]}
      ]
    },
    {
      id:"strathern", name:"玛丽琳·斯特拉森", en:"Marilyn Strathern",
      born:1941, died:null, country:"英国", period:"contemp",
      branches:["mind","theory"], regions:["巴布亚新几内亚","美拉尼西亚"],
      tags:["礼物与商品","关系性人格","自然之后"],
      summary:"美拉尼西亚研究大家与本体论转向的先驱。她指出西方个体观并非普适，人格是关系性的，进而拆解“自然/文化”的二分。",
      statements:[
        {id:"strathern-gift", key:true, year:1988, branch:"mind", work:"《礼物的性别》",
         text:"美拉尼西亚的人格是关系性的：礼物与商品的对立本身是西方范畴。",
         links:[{to:"mauss-gift", type:"agree", note:"礼物范式的当代重读与批判。"}]},
        {id:"strathern-nature", key:true, year:1992, branch:"theory", work:"《自然之后》",
         text:"“自然”也是文化概念：自然/文化的二分需要被人类学重新检验。",
         links:[
           {to:"descola-ontology", type:"agree", note:"本体论转向的英国版本。"},
           {to:"latour-modern", type:"agree", note:"共同瓦解自然/社会二分。"}
         ]},
        {id:"strathern-women-in-between", year:1972, branch:"kinship", work:"《居间的女性》",
         text:"哈根人社会中女性的“居间”位置：性别不是对称的二分，而与交换关系的位置有关。",
         links:[
           {to:"strathern-gift", type:"agree", note:"日后《礼物的性别》经验基础。"},
           {to:"rubin-traffic", type:"agree", note:"与《女人交易》同样把女性放在交换结构中分析。"}
         ]},
        {id:"strathern-audit", year:2000, branch:"theory", work:"《审计文化》",
         text:"审计与问责制度重塑了大学与文化的自我评价：可计量性成为新的评价道德。",
         links:[
           {to:"strathern-nature", type:"agree", note:"从自然的再造延伸到评价体系的再造。"},
           {to:"bourdieu-distinction", type:"agree", note:"评价标准如何把社会差异自然化的另一条路径。"}
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
        {id:"descola-ontology", key:true, year:2005, branch:"theory", work:"《超越自然与文化》",
         text:"四种本体论：不同的存在论图式组织着人类与非人类之间的连续与断裂。",
         links:[{to:"viveiros-perspectivism", type:"agree", note:"与亚马逊视角主义共享本体论转向的问题意识。"}]},
        {id:"descola-naturalism", key:true, year:2005, branch:"religion", work:"《超越自然与文化》",
         text:"“自然主义”（自然/文化二分）只是西方特有的图式，并非人类的普遍经验。",
         links:[]},
        {id:"descola-spears", year:1993, branch:"theory", work:"《暮光之矛》",
         text:"人类学的知识来自长期共居：阿丘雅人的世界不是被“观察”的，而是在共同生活中逐渐展开的。",
         links:[{to:"malinowski-method", type:"agree", note:"对长期田野方法的当代重述。"}]},
        {id:"descola-ecology", year:2011, branch:"economic", work:"《他者的生态学》",
         text:"生态学与人类学的分界本身就是历史产物：自然与文化的区分不应当作分析前提。",
         links:[
           {to:"descola-naturalism", type:"agree", note:"“四种本体论”命题在生态学问题上的延伸。"},
           {to:"ingold-dwelling", type:"agree", note:"与英戈尔德一样拒绝把自然当作外部环境。"}
         ]}
      ]
    },
    {
      id:"viveiros", name:"爱德华多·维韦罗斯·德·卡斯特罗", en:"Eduardo Viveiros de Castro",
      born:1951, died:null, country:"巴西", period:"contemp",
      branches:["theory","religion"], regions:["亚马逊"],
      tags:["视角主义","多物种","食人本体论"],
      summary:"亚马逊视角主义与“多物种民族志”的旗手。他主张在美洲原住民的世界里，人与动物共享文化而身体各异，视角决定世界的样子。",
      statements:[
        {id:"viveiros-perspectivism", key:true, year:1998, branch:"theory", work:"《宇宙论指示与美洲印第安视角主义》",
         text:"视角主义：人与非人共享文化而身体不同，视角决定各自看到的世界。",
         links:[{to:"strathern-gift", type:"agree", note:"关系性人格与本体论多元的南美版本。"}]},
        {id:"viveiros-multispecies", key:true, year:2009, branch:"religion", work:"《食人形而上学》",
         text:"人类学应当研究人与非人的共存：食人、萨满与多物种的关系本体论。",
         links:[
           {to:"tsing-mushroom", type:"agree", note:"多物种转向的共同推动者。"},
           {to:"latour-actors", type:"agree", note:"把非人行动者纳入社会分析。"}
         ]},
        {id:"viveiros-soul", year:2002, branch:"religion", work:"《野性灵魂的不恒》",
         text:"灵魂的不恒性：美洲印第安思想中人、动物与物之间的身份可以持续变换，由此产生对亲属、食物与敌人的特殊伦理。",
         links:[
           {to:"viveiros-perspectivism", type:"agree", note:"视角主义的经验与哲学基础。"},
           {to:"strathern-gift", type:"agree", note:"与美拉尼西亚的关系性人格研究相互对照，是“本体论转向”的两翼。"}
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
        {id:"latour-modern", key:true, year:1991, branch:"global", work:"《我们从未现代过》",
         text:"现代性的“纯化”与“杂合”并行：自然—社会的二分从未真正成立。",
         links:[]},
        {id:"latour-actors", key:true, year:1999, branch:"theory", work:"《潘多拉的希望》",
         text:"给予非人者能动性：微生物、仪器与田野同样是社会过程的行动者。",
         links:[]},
        {id:"latour-irreductions", year:1984, branch:"theory", work:"《不可还原》",
         text:"任何还原都不成立：自然与社会都是同一过程的两种产物。",
         links:[{to:"latour-lab", type:"agree", note:"《实验室生活》的哲学表述。"}]},
        {id:"latour-reassembling", year:2005, branch:"theory", work:"《重组社会》",
         text:"“社会”不是解释的起点而是需要解释的东西；行动者网络理论要求跟随行动者，而非预设社会结构。",
         links:[
           {to:"latour-actors", type:"agree", note:"行动者网络理论的系统教科书表述。"},
           {to:"strathern-audit", type:"disagree", note:"斯特拉森提醒：追随行动者同样受制于研究者自身的文化装置。"}
         ]},
        {id:"latour-gaia", year:2015, branch:"economic", work:"《面对盖亚》",
         text:"气候危机要求重写政治与土地的定义：人类与非人类共同构成的新气候体制。",
         links:[
           {to:"tsing-mushroom", type:"agree", note:"与《在世界尽头遇见蘑菇》同属“人类世”问题域。"},
           {to:"viveiros-soul", type:"agree", note:"都为“非人也有能动性”提供论证。"}
         ]}
      ]
    },
    {
      id:"tsing", name:"罗安清（崔静）", en:"Anna Lowenhaupt Tsing",
      born:1952, died:null, country:"美国", period:"contemp",
      branches:["economic","global","theory"], regions:["印尼","北美森林"],
      tags:["摩擦","多物种","松茸"],
      summary:"多物种民族志的代表人物。她以“摩擦”描述全球连接的差异与不平等，并以松茸供应链呈现资本废墟中的共存与生计。",
      statements:[
        {id:"tsing-friction", key:true, year:2005, branch:"global", work:"《摩擦》",
         text:"摩擦：全球连接并非平滑流动，差异与不平等在接触带中产生动力。",
         links:[{to:"appadurai-global", type:"agree", note:"对全球流动理论的民族志修正。"}]},
        {id:"tsing-mushroom", key:true, year:2015, branch:"economic", work:"《在世界尽头遇见蘑菇》",
         text:"松茸的供应链串联森林、采集者与资本：废墟中的生计与多物种共存。",
         links:[{to:"latour-actors", type:"agree", note:"行动者网络与多物种取向的汇合。"}]},
        {id:"tsing-diamond-queen", year:1993, branch:"global", work:"《钻石女王的领域》",
         text:"边地不是未被触达的边缘，而是权力关系被制造出来的场所：边缘性是关系，不是位置。",
         links:[
           {to:"tsing-friction", type:"agree", note:"边地政治的先期研究。"},
           {to:"wolf-history", type:"agree", note:"与沃尔夫一样拒绝把边缘社会置于世界历史之外。"}
         ]},
        {id:"tsing-feral-atlas", year:2021, branch:"economic", work:"《野性图谱》（合编）",
         text:"“野性化”：在人类世中，非人类因素以无法被规划的方式增殖，人类基础设施反而成为新的野性源头。",
         links:[
           {to:"tsing-mushroom", type:"agree", note:"把蘑菇研究的“协作式生存”扩展为多物种的问题域。"},
           {to:"latour-gaia", type:"agree", note:"与拉图尔的盖亚命题相互呼应。"}
         ]}
      ]
    },
    {
      id:"abu-lughod", name:"莉拉·阿布-卢格霍德", en:"Lila Abu-Lughod",
      born:1952, died:null, country:"美国 / 巴勒斯坦", period:"contemp",
      branches:["mind","global"], regions:["埃及","贝都因人"],
      tags:["情感与诗歌","抵抗","书写反文化"],
      summary:"中东民族志大家。她以贝都因人的诗歌研究展示情感与抵抗的微妙关系，并呼吁“书写反文化”，警惕“文化”概念固化他者。",
      statements:[
        {id:"abu-poetry", key:true, year:1986, branch:"mind", work:"《面纱的情感》",
         text:"贝都因人的诗歌：在权力压迫之下，诗歌成为表达异议与情感的安全方式。",
         links:[
           {to:"geertz-deep", type:"agree", note:"把意义分析放进权力关系。"},
           {to:"rosaldo-passion", type:"agree", note:"情感人类学的核心案例。"}
         ]},
        {id:"abu-writing", year:1991, branch:"global", work:"《书写反文化》",
         text:"“文化”概念可能固化他者：写作应当反对本质化的文化差异。",
         links:[{to:"clifford-authority", type:"agree", note:"实验民族志批判的延伸。"}]},
        {id:"abu-muslim-women", key:true, year:2002, branch:"global", work:"《穆斯林女性需要被拯救吗？》",
         text:"“拯救穆斯林女性”的话语把复杂的处境简化为文化压迫；应当研究具体的处境与愿望。",
         links:[
           {to:"abu-writing", type:"agree", note:"对“反文化书写”立场的延续：拒绝总括性的他者叙述。"},
           {to:"ortner-nature", type:"disagree", note:"批评早期的普遍性性别二元框架难以处理具体处境。"}
         ]},
        {id:"abu-dramas", year:2005, branch:"global", work:"《国族的戏剧》",
         text:"电视与民族想象：埃及的国家电视台试图塑造“现代”主体，观众却以自己的方式解释与挪用。",
         links:[{to:"appadurai-imagined", type:"agree", note:"与阿帕杜莱的媒介与想象研究直接对话。"}]}
      ]
    },
    {
      id:"obeyesekere", name:"加纳纳特·奥贝耶塞凯雷", en:"Gananath Obeyesekere",
      born:1930, died:null, country:"斯里兰卡", period:"contemp",
      branches:["religion","global"], regions:["斯里兰卡","夏威夷"],
      tags:["库克船长之争","实践理性"],
      summary:"以“库克船长是否被当作神”的论战闻名的人类学家，主张夏威夷人拥有自身的实践理性，而非依附于外来神话图式。",
      statements:[
        {id:"obeyesekere-cook", key:true, year:1992, branch:"religion", work:"《库克船长的神化》",
         text:"库克船长不是神：夏威夷人以其自身的实践理性应对来客，“神化”是被建构的叙事。",
         links:[{to:"sahlins-islands", type:"disagree", note:"与萨林斯的结构—历史解释针锋相对。"}]},
        {id:"obeyesekere-medusa", year:1981, branch:"religion", work:"《美杜莎的头发》",
         text:"个人象征与集体象征：苦行者的幻觉既是个人经验的产物，也能成为公共象征。",
         links:[{to:"obeyesekere-cook", type:"agree", note:"同一方法论的两种运用：心理经验如何进入历史文化。"}]},
        {id:"obeyesekere-work", key:true, year:1990, branch:"religion", work:"《文化的工作》",
         text:"“文化工作”：欲望与创伤被转化为象征形式，宗教与艺术因此同时是心理的与社会的。",
         links:[
           {to:"obeyesekere-medusa", type:"agree", note:"把 1981 年的命题系统化。"},
           {to:"bateson-double-bind", type:"agree", note:"两条路径都主张心理经验必须在关系与文化中被理解。"}
         ]}
      ]
    },
    {
      id:"freeman", name:"德里克·弗里曼", en:"Derek Freeman",
      born:1916, died:2001, country:"新西兰 / 澳大利亚", period:"contemp",
      branches:["mind"], regions:["萨摩亚"],
      tags:["萨摩亚争论","生物与文化"],
      summary:"因对米德萨摩亚研究的再访与批评而载入学科史，他认为当地信息人的讲述误导了米德，青春期行为不能只归因于文化。",
      statements:[
        {id:"freeman-revisit", key:true, year:1983, branch:"mind", work:"《玛格丽特·米德与萨摩亚》",
         text:"萨摩亚再访：米德被当地讲述所误导，青春期的生物学因素不容忽视。",
         links:[{to:"mead-samoa", type:"disagree", note:"人类学史上最著名的论战之一。"}]},
        {id:"freeman-hoaxing", key:true, year:1999, branch:"mind", work:"《米德命运攸关的恶作剧》",
         text:"弗里曼进一步主张：米德当年被萨摩亚报道人误导，其青春期结论因此不可靠。",
         links:[
           {to:"freeman-revisit", type:"agree", note:"对同一争议的追加论证。"},
           {to:"mead-samoa", type:"disagree", note:"争议核心：田野材料的可靠性如何被验证。"}
         ]}
      ]
    },
    {
      id:"fei", name:"费孝通", en:"Fei Xiaotong",
      born:1910, died:2005, country:"中国", period:"interp",
      branches:["kinship","economic","theory"], regions:["江苏开弦弓村","中国"],
      tags:["江村经济","差序格局","乡土中国","多元一体"],
      summary:"中国社会学与人类学的奠基人。他以江村研究开创经济人类学的中国范式，又以“差序格局”刻画中国社会的关系结构。",
      statements:[
        {id:"fei-peasant", key:true, year:1939, branch:"economic", work:"《江村经济》",
         text:"《江村经济》：一个村庄的消费、生产与亲属网络，呈现中国农村社会的完整图景。",
         links:[{to:"malinowski-method", type:"agree", note:"马林诺夫斯基作序：从海岛到中国乡村的田野研究扩展。"}]},
        {id:"fei-chaxu", key:true, year:1947, branch:"kinship", work:"《乡土中国》",
         text:"差序格局：中国人的关系以自我为中心、按亲疏水波式外推，而非西方团体格局。",
         links:[{to:"schneider-american", type:"agree", note:"亲属与关系是文化范畴，而不只是谱系计算。"}]},
        {id:"fei-ritual", year:1947, branch:"political", work:"《乡土中国》",
         text:"礼治秩序：乡土社会依靠教化与习俗维持秩序，而非国家法律。",
         links:[{to:"gluckman-judicial", type:"agree", note:"与习惯法研究相互印证。"}]},
        {id:"fei-multiunity", year:1988, branch:"global", work:"《中华民族的多元一体格局》",
         text:"中华民族的多元一体格局：各民族在长期历史互动中形成不可分割的整体。",
         links:[]},
        {id:"fei-reproduction", year:1947, branch:"kinship", work:"《生育制度》",
         text:"婚姻与家庭是为解决“抚育”问题而设的制度安排：亲属制度的核心功能是社会性的世代延续。",
         links:[
           {to:"fei-chaxu", type:"agree", note:"与《乡土中国》同期，共同构成对中国社会的结构分析。"},
           {to:"malinowski-sex-family", type:"agree", note:"延续马林诺夫斯基关于亲属关系由社会约定而非生理决定的主张。"}
         ]},
        {id:"fei-small-town", year:1984, branch:"economic", work:"《小城镇大问题》",
         text:"乡镇企业是中国城乡关系的调节器：乡村工业化提供了不流入大城市的另一条现代化路径。",
         links:[{to:"fei-peasant", type:"agree", note:"回访江村之后的追踪研究，延续社区研究方法。"}]},
        {id:"fei-cultural-awareness", key:true, year:1997, branch:"theory", work:"《反思·对话·文化自觉》",
         text:"“文化自觉”：在全球化中理解自身文化的位置，既不照搬也不封闭，是跨文化对话的前提。",
         links:[
           {to:"fei-multiunity", type:"agree", note:"与“多元一体”同属对文化关系格局的思考。"},
           {to:"appadurai-global", type:"agree", note:"与全球化研究的对话：地方文化如何在流动中自我定位。"}
         ]}
      ]
    },
    {
      id:"lin", name:"林耀华", en:"Lin Yaohua",
      born:1910, died:2000, country:"中国", period:"interp",
      branches:["kinship"], regions:["福建","凉山"],
      tags:["金翼","宗族","凉山彝家"],
      summary:"中国人类学的代表人物之一。他既是家族个案研究的先驱，也系统研究了凉山彝家的亲属制度与等级结构。",
      statements:[
        {id:"lin-golden", key:true, year:1944, branch:"kinship", work:"《金翼》",
         text:"《金翼》：两个家族的兴衰史展现宗族、姻亲与市场网络如何编织地方社会。",
         links:[{to:"fei-peasant", type:"agree", note:"同一学术传统中的中国家族个案研究。"}]},
        {id:"lin-lolo", year:1947, branch:"kinship", work:"《凉山彝家》",
         text:"凉山彝家的亲属与等级研究，呈现中国民族志对“简单社会”的理论关怀。",
         links:[{to:"radcliffe-brown-structure", type:"agree", note:"世系与等级结构的中国案例。"}]},
        {id:"lin-ancestors", key:true, year:1948, branch:"kinship", work:"《祖荫下》",
         text:"祖先崇拜与家族制度塑造人格：中国家族的权威、竞争与庇护，在“祖荫”之下形成特定的性格取向。",
         links:[
           {to:"lin-golden", type:"agree", note:"与《金翼》同一田野的第二次书写，转向文化与人格问题。"},
           {to:"benedict-patterns", type:"agree", note:"把“文化与人格”方法用于汉人社会。"},
           {to:"fortes-ancestors", type:"agree", note:"与福特斯关于祖先崇拜的研究可比较：祖先同时组织道德与权力。"}
         ]}
      ]
    },
    {
      id:"yan", name:"阎云翔", en:"Yunxiang Yan",
      born:1954, died:null, country:"中国 / 美国", period:"contemp",
      branches:["kinship","economic"], regions:["黑龙江下岬村"],
      tags:["礼物的流动","私人生活","个体化"],
      summary:"以东北乡村的长期回访著称。他研究礼物流动与人情网络的当代变化，也记录了中国家庭与私人生活的个体化转型。",
      statements:[
        {id:"yan-gift", key:true, year:1996, branch:"economic", work:"《礼物的流动》",
         text:"下岬村的礼物流动显示：人情与关系网络是乡土社会再生产的核心机制。",
         links:[
           {to:"fei-chaxu", type:"agree", note:"对“差序格局”的当代经验检验。"},
           {to:"mauss-gift", type:"agree", note:"礼物范式在中国乡村的验证与修正。"}
         ]},
        {id:"yan-private", key:true, year:2003, branch:"kinship", work:"《私人生活的变革》",
         text:"集体化与市场化重塑了家庭与情感：私人生活从家族伦理中逐步脱离。",
         links:[{to:"ortner-practice", type:"agree", note:"实践与能动性视角下的中国家庭变迁。"}]},
        {id:"yan-individualization", year:2009, branch:"kinship", work:"《中国社会的个体化》",
         text:"个体化不是西方化的结果：国家政策、市场与家庭共同把个人从集体中释放出来，也把风险留给了个人。",
         links:[
           {to:"yan-private", type:"agree", note:"《私人生活的变革》的理论总结。"},
           {to:"dumont-individualism", type:"disagree", note:"杜蒙把个体主义当作西方特有的意识形态，中国的经验显示它可由国家推动形成。"}
         ]}
      ]
    },
    {
      id:"childe", name:"戈登·柴尔德", en:"V. Gordon Childe",
      born:1892, died:1957, country:"英国 / 澳大利亚", period:"struct",
      branches:["archaeology"], regions:["欧洲","中东"],
      tags:["新石器革命","城市革命","文化史考古"],
      summary:"二十世纪最有影响的史前考古学家。他以“新石器革命”“城市革命”概括社会演化的大转折，并奠定文化史考古学的方法框架。",
      statements:[
        {id:"childe-neolithic", key:true, year:1936, branch:"archaeology", work:"《人类创造自身》",
         text:"新石器革命与城市革命：谷物、定居与剩余带来社会分层与早期国家。",
         links:[]},
        {id:"childe-culturehistory", year:1925, branch:"archaeology", work:"《欧洲文明的曙光》",
         text:"文化史考古学：以器物组合界定“考古文化”，并追踪其传播与演变。",
         links:[]},
        {id:"childe-danube", year:1929, branch:"archaeology", work:"《多瑙河史前史》",
         text:"以类型学与地层建立区域文化序列：考古学第一次能够系统整理欧洲史前史的时空框架。",
         links:[{to:"childe-culturehistory", type:"agree", note:"《欧洲文明的曙光》方法论的展开。"}]},
        {id:"childe-urban-revolution", key:true, year:1950, branch:"archaeology", work:"《城市革命》",
         text:"城市革命：剩余产品、专职化、文字与公共建筑的出现，标志国家形成的考古学判据。",
         links:[
           {to:"childe-neolithic", type:"agree", note:"“新石器革命”之后的第二次社会剧变。"},
           {to:"morgan-civitas", type:"agree", note:"与摩尔根“血缘到地域”的命题可比较，但改以考古材料为证据。"}
         ]},
        {id:"childe-social-evolution", year:1951, branch:"archaeology", work:"《社会进化》",
         text:"考古材料可以讨论社会演化与不平等，而不是只能罗列器物与年代。",
         links:[{to:"childe-urban-revolution", type:"agree", note:"把考古学与社会科学理论结合的宣言。"}]}
      ]
    },
    {
      id:"binford", name:"路易斯·宾福德", en:"Lewis Binford",
      born:1931, died:2011, country:"美国", period:"interp",
      branches:["archaeology","theory"], regions:["美国","北极"],
      tags:["新考古学","过程考古学","中程理论"],
      summary:"“新考古学”的旗手。他要求考古学成为解释文化过程的人类学，并以民族考古学建立遗存与行为之间的推理桥梁。",
      statements:[
        {id:"binford-science", key:true, year:1962, branch:"archaeology", work:"《作为人类学的考古学》",
         text:"考古学即人类学：遗存应当回答社会与文化过程的规律问题，而不只是编年与文化史。",
         links:[{to:"childe-culturehistory", type:"disagree", note:"新考古学批评文化史方法，却继承了其社会演化的问题意识。"}]},
        {id:"binford-midrange", year:1977, branch:"archaeology", work:"《建立考古学理论》",
         text:"中程理论：用民族考古学在静态遗存与动态行为之间建立可检验的推论。",
         links:[]},
        {id:"binford-nunamiut", year:1978, branch:"archaeology", work:"《努纳缪特民族考古学》",
         text:"民族考古学：通过观察当代猎民的营地与弃置过程，为解读考古遗存建立“中间理论”。",
         links:[{to:"binford-midrange", type:"agree", note:"中间理论的实践版本。"}]},
        {id:"binford-bones", key:true, year:1981, branch:"archaeology", work:"《骨头：古代人与现代神话》",
         text:"骨骼组合的埋藏学分析可以区分狩猎、食腐与自然堆积：从静态遗存推断动力过程需要严格的推理链。",
         links:[
           {to:"binford-science", type:"agree", note:"把“考古学即人类学”的科学纲领落到具体推理上。"},
           {to:"washburn-hunting", type:"agree", note:"狩猎假说在考古学中被检验与修正的典型案例。"}
         ]}
      ]
    },
    {
      id:"hodder", name:"伊恩·霍德", en:"Ian Hodder",
      born:1948, died:null, country:"英国", period:"contemp",
      branches:["archaeology"], regions:["土耳其","恰塔霍裕克"],
      tags:["后过程考古","物质文化","解释考古"],
      summary:"后过程考古学的创始人。他主张器物与风格是能动的象征，考古解释必然包含当代的政治与意义争夺。",
      statements:[
        {id:"hodder-symbolic", key:true, year:1982, branch:"archaeology", work:"《行动中的象征》",
         text:"物质文化是能动的象征：器物与风格参与社会策略与身份建构。",
         links:[
           {to:"douglas-grid", type:"agree", note:"象征分类分析在考古学中的运用。"},
           {to:"childe-culturehistory", type:"disagree", note:"批评文化史与传播论把物质文化当作被动标记。"}
         ]},
        {id:"hodder-reading", year:1986, branch:"archaeology", work:"《解读过去》",
         text:"后过程考古：物质文化是“文本”，解释必然包含当代的立场与政治。",
         links:[{to:"binford-science", type:"disagree", note:"过程考古的科学主义与后过程考古的解释学之争。"}]},
        {id:"hodder-domestication", year:1990, branch:"archaeology", work:"《驯化的领域》",
         text:"驯化不只是经济适应：农业与聚落是“家”（domus）这一象征结构的物质化，欧洲史前史可以被读作意义的构造。",
         links:[
           {to:"hodder-symbolic", type:"agree", note:"把象征考古学应用于新石器时代转型。"},
           {to:"childe-neolithic", type:"disagree", note:"反对把新石器革命单纯解释为经济与技术的必然结果。"}
         ]},
        {id:"hodder-entangled", key:true, year:2012, branch:"archaeology", work:"《纠缠》",
         text:"人与物的纠缠：依赖与依附（entanglement）既推动创新，也解释停滞与陷阱。",
         links:[
           {to:"hodder-reading", type:"agree", note:"物质文化理论从文本隐喻转向关系本体论。"},
           {to:"latour-actors", type:"agree", note:"与行动者网络理论共享“物也有能动性”的立场。"},
           {to:"tsing-mushroom", type:"agree", note:"与多物种研究同样关注人与非人的相互依赖。"}
         ]}
      ]
    },
    {
      id:"washburn", name:"舍伍德·沃什伯恩", en:"Sherwood Washburn",
      born:1911, died:2000, country:"美国", period:"struct",
      branches:["biological"], regions:["美国","非洲"],
      tags:["新体质人类学","功能解剖","灵长类"],
      summary:"“新体质人类学”的倡导者。他推动体质人类学从形态测量转向遗传学与功能解剖，并把灵长类行为研究纳入人类进化的解释。",
      statements:[
        {id:"washburn-newphys", key:true, year:1951, branch:"biological", work:"《新体质人类学》",
         text:"人类进化研究应基于遗传学与功能解剖的实验方法，而非静态的人种测量。",
         links:[{to:"boas-fourfields", type:"disagree", note:"体质研究脱离四分支的文化史框架，走向生物科学。"}]},
        {id:"washburn-primate", year:1951, branch:"biological", work:"《新体质人类学》",
         text:"行为与形态相应演化：野外灵长类研究是理解人类行为进化的窗口。",
         links:[]},
        {id:"washburn-hunting", key:true, year:1968, branch:"biological", work:"《狩猎的演化》（与兰卡斯特合著）",
         text:"狩猎假说：狩猎与肉食推动了脑量扩张、工具使用与两足行走，是人类进化的关键选择压力。",
         links:[
           {to:"washburn-primate", type:"agree", note:"以灵长类比较研究为进化推断的基础。"},
           {to:"hrdy-woman", type:"disagree", note:"后来者批评：以男性活动为中心的模型忽略了采集、育儿与女性灵长类的策略。"}
         ]}
      ]
    },
    {
      id:"montagu", name:"阿什利·蒙塔古", en:"Ashley Montagu",
      born:1905, died:1999, country:"英国 / 美国", period:"struct",
      branches:["biological","global"], regions:["英国","美国"],
      tags:["种族神话","UNESCO","反种族主义"],
      summary:"以科学反击种族主义的代表。他的《人类最危险的神话》系统拆解种族概念，并为联合国教科文组织起草了战后首份种族宣言。",
      statements:[
        {id:"montagu-myth", key:true, year:1942, branch:"biological", work:"《人类最危险的神话：种族谬误》",
         text:"种族是一个社会神话：所谓种族差异其实是渐变的地理连续体。",
         links:[{to:"boas-relativism", type:"agree", note:"与博厄斯的反种族主义科学立场一脉相承。"}]},
        {id:"montagu-unesco", year:1950, branch:"global", work:"《UNESCO 种族宣言》",
         text:"科学界应当明确拒绝以生物学论证种族不平等的任何企图。",
         links:[]},
        {id:"montagu-concept-race", key:true, year:1964, branch:"biological", work:"《种族概念》（主编）",
         text:"“种族”作为分类概念在科学上已经失效：人口之间的差异是连续的、渐变的。",
         links:[
           {to:"montagu-myth", type:"agree", note:"把反种族主义论证从普及写作推进到学科概念清理。"},
           {to:"lewontin-apportionment", type:"agree", note:"与群体内变异大于群体间变异的遗传学证据相互支持。"}
         ]},
        {id:"montagu-touching", year:1971, branch:"biological", work:"《触摸》",
         text:"皮肤接触与身体亲密对人类发展至关重要：养育不只是营养供给，也是感觉与情感的给予。",
         links:[{to:"mead-newguinea", type:"agree", note:"与儿童养育研究相呼应：社会化过程有身体与情感的基础。"}]}
      ]
    },
    {
      id:"lewontin", name:"理查德·列文廷", en:"Richard Lewontin",
      born:1929, died:2021, country:"美国", period:"interp",
      branches:["biological"], regions:["美国"],
      tags:["群体遗传学","生物决定论批判"],
      summary:"进化遗传学家与生物决定论的坚定批判者。他用群体遗传学数据证明人类变异主要存在于群体内部，“人种”之间的差异极小。",
      statements:[
        {id:"lewontin-apportionment", key:true, year:1972, branch:"biological", work:"《人类多样性的分配》",
         text:"人类遗传变异的约 85% 存在于群体内部；所谓“人种”之间的差异极小。",
         links:[{to:"montagu-unesco", type:"agree", note:"为反种族主义提供了群体遗传学证据。"}]},
        {id:"lewontin-genes", year:1984, branch:"biological", work:"《不在我们的基因里》",
         text:"生物决定论是意识形态而非科学结论：社会不平等不能化约为基因。",
         links:[{to:"freeman-revisit", type:"disagree", note:"反对把行为差异主要归因于生物天性。"}]},
        {id:"lewontin-spandrels", key:true, year:1979, branch:"biological", work:"《圣马可大教堂的拱肩》（与古尔德合著）",
         text:"适应主义批判：不能把每个性状都当作自然选择的直接产物，结构与约束同样可以产生看似设计的形态。",
         links:[
           {to:"lewontin-genes", type:"agree", note:"对生物决定论批判的方法论版本。"},
           {to:"dewaal-morality", type:"disagree", note:" critiques：把动物行为直接读成道德能力，容易重复适应主义的推理错误。"}
         ]},
        {id:"lewontin-ideology", year:1991, branch:"biological", work:"《生物学作为意识形态》",
         text:"生物学常被用来为既存社会秩序提供自然化说明；科学结论与政治用途之间必须被区分对待。",
         links:[
           {to:"montagu-myth", type:"agree", note:"与战后的科学反种族主义同一战线。"},
           {to:"lewontin-apportionment", type:"agree", note:"以遗传学证据反驳种族与智力的人为关联。"}
         ]}
      ]
    },
    {
      id:"goodall", name:"珍·古道尔", en:"Jane Goodall",
      born:1934, died:null, country:"英国", period:"interp",
      branches:["biological"], regions:["坦桑尼亚贡贝"],
      tags:["黑猩猩","长期田野","工具使用"],
      summary:"灵长类研究的象征人物。她在贡贝的长期观察证明黑猩猩会制造工具、拥有复杂社会与情感生活，改变了人类独特性的定义。",
      statements:[
        {id:"goodall-tools", key:true, year:1971, branch:"biological", work:"《在人类的阴影下》",
         text:"黑猩猩会制造和使用工具：人类的独特性因此需要重新定义。",
         links:[{to:"washburn-primate", type:"agree", note:"野外灵长类研究作为理解人类进化的窗口。"}]},
        {id:"goodall-gombe", year:1986, branch:"biological", work:"《贡贝的黑猩猩》",
         text:"长期、个体化的野外观察，是理解灵长类社会与情感的必要方法。",
         links:[]},
        {id:"goodall-window", key:true, year:1990, branch:"biological", work:"《透过窗子》",
         text:"贡贝黑猩猩的“战争”与杀婴：灵长类社会的暴力与联盟同样需要长期个体史才能理解。",
         links:[
           {to:"goodall-gombe", type:"agree", note:"长期观察成果的第二个阶段。"},
           {to:"dewaal-politics", type:"agree", note:"与《黑猩猩的政治》同样以个体关系解释群体政治。"}
         ]},
        {id:"goodall-hope", year:1999, branch:"global", work:"《希望的理由》",
         text:"研究、保育与动物福利不可分割：科学家的道德立场是研究的一部分。",
         links:[{to:"goodall-tools", type:"agree", note:"把对黑猩猩个体的关注推进为伦理主张。"}]}
      ]
    },
    {
      id:"dewaal", name:"弗朗斯·德瓦尔", en:"Frans de Waal",
      born:1948, died:2024, country:"荷兰 / 美国", period:"contemp",
      branches:["biological","mind"], regions:["荷兰","美国"],
      tags:["黑猩猩政治","动物道德","共情"],
      summary:"灵长类社会行为研究的代表。他以黑猩猩的联盟与权力斗争研究著称，并论证共情与公平感在演化上有着深厚根基。",
      statements:[
        {id:"dewaal-politics", key:true, year:1982, branch:"biological", work:"《黑猩猩的政治》",
         text:"黑猩猩的联盟、欺骗与权力斗争，显示政治行为的演化连续性。",
         links:[{to:"goodall-gombe", type:"agree", note:"延续长期个体观察的传统。"}]},
        {id:"dewaal-morality", key:true, year:1996, branch:"mind", work:"《善良的本性》",
         text:"动物道德：共情与公平感的演化根基，挑战“文化/自然”的绝对分界。",
         links:[{to:"descola-naturalism", type:"agree", note:"为人类与动物的连续性提供了行为学证据。"}]},
        {id:"dewaal-bonobo", year:1997, branch:"biological", work:"《波诺波：被遗忘的猿》",
         text:"波诺波以性行为与社会联系缓和冲突：只研究黑猩猩会把“猿性”误当作人性的唯一样本。",
         links:[
           {to:"dewaal-politics", type:"agree", note:"扩展比较样本，修正以黑猩猩为唯一模型的倾向。"},
           {to:"washburn-hunting", type:"disagree", note:"对人类进化中暴力与竞争的强调，需要在灵长类多样性的证据前被重新审视。"}
         ]},
        {id:"dewaal-empathy", year:2009, branch:"biological", work:"《共情时代》",
         text:"共情与公平感有深厚的演化根基：道德不是文化从外部强加的成果。",
         links:[{to:"dewaal-morality", type:"agree", note:"《善良的本性》的延伸与普及。"}]}
      ]
    },
    {
      id:"kleinman", name:"凯博文", en:"Arthur Kleinman",
      born:1941, died:null, country:"美国", period:"contemp",
      branches:["mind","global"], regions:["台湾","中国大陆","美国"],
      tags:["医学人类学","解释模型","疾病叙事"],
      summary:"医学人类学的奠基人之一。他把“深描”带入医疗场域，以解释模型与疾病叙事呈现病痛的意义维度，深刻影响全球医学人文教育。",
      statements:[
        {id:"kleinman-models", key:true, year:1980, branch:"mind", work:"《文化情境中的病人与医者》",
         text:"解释模型：病人、家属与医者对疾病的理解各不相同，医疗是意义的协商。",
         links:[{to:"geertz-interpretation", type:"agree", note:"把深描与意义分析应用于医疗场域。"}]},
        {id:"kleinman-narratives", key:true, year:1988, branch:"mind", work:"《疾病叙事》",
         text:"疾病叙事：躯体症状与道德意义相连，病痛经验应当被当作叙事来理解。",
         links:[{to:"rosaldo-passion", type:"agree", note:"情感与经验研究在医学人类学中的延伸。"}]},
        {id:"kleinman-neurasthenia", year:1986, branch:"mind", work:"《苦痛的社会根源》",
         text:"中国语境中的“神经衰弱”：抑郁以躯体症状与道德语言被表达，诊断分类本身反映文化条件。",
         links:[
           {to:"kleinman-models", type:"agree", note:"解释模型理论在华人社会的经验研究。"},
           {to:"fei-chaxu", type:"agree", note:"对中国社会关系与道德语言的共同关注。"}
         ]},
        {id:"kleinman-social-suffering", year:1997, branch:"global", work:"《社会苦难》（与达斯、洛克合编）",
         text:"苦难有其社会来源：暴力、贫困与制度性的漠视如何被体验，需要跨学科的共同研究。",
         links:[
           {to:"das-violence", type:"agree", note:"与达斯的暴力研究互补：苦难既是个人的也是政治的。"},
           {to:"farmer-violence", type:"agree", note:"与法默的“结构性暴力”概念直接呼应。"}
         ]},
        {id:"kleinman-caregiving", year:2019, branch:"mind", work:"《照护的灵魂》",
         text:"照护是一种道德实践：医学技术无法替代陪伴与责任，而照护者的消耗本身值得被研究。",
         links:[
           {to:"kleinman-social-suffering", type:"agree", note:"从社会苦难转向照护，是同一问题的另一面。"},
           {to:"luhrmann-mind", type:"agree", note:"都主张把内在经验与制度条件放在一起理解。"}
         ]}
      ]
    },
{
      id:"ingold", name:"蒂姆·英戈尔德", en:"Tim Ingold",
      born:1948, died:null, country:"英国", period:"contemp",
      branches:["economic", "theory"], regions:["芬兰（萨米地区）", "英国"],
      tags:["栖居视角", "技能", "线", "制作"],
      summary:"生态人类学与“栖居视角”的代表。他反对把文化当作加在自然之上的表象系统，主张人通过技能与实践“栖居”于环境之中。",
      statements:[
                {id:"ingold-dwelling", key:true, year:2000, branch:"theory", work:"《环境的感知》",
         text:"栖居视角：人不是先在心里表征环境再行动，而是在技能与实践中与环境相互生成。",
         links:[{to:"descola-ecology", type:"agree", note:"与“自然/文化之分不可当作前提”的主张同路。"}]},
                {id:"ingold-hunters-pastoralists", year:1980, branch:"economic", work:"《猎人、牧民与牧场主》",
         text:"驯养关系是一条连续谱：驯鹿放牧介于狩猎与畜牧之间，不能用二分的经济类型概括。",
         links:[{to:"ingold-dwelling", type:"agree", note:"北方民族的经验研究构成其理论的出发点。"}]},
                {id:"ingold-lines", key:true, year:2007, branch:"theory", work:"《线：一段简史》",
         text:"把生活理解为线的缠绕：行走、编织与书写都是“沿线而居”，现代性则把线拉直为运输与传播。",
         links:[{to:"ingold-dwelling", type:"agree", note:"栖居视角在时间与路径维度上的展开。"}]},
                {id:"ingold-making", year:2013, branch:"theory", work:"《制作》",
         text:"制作是与材料对话的形态发生过程，不是把设计施加于被动的质料；人类学、考古学与艺术因此可以共享方法。",
         links:[
           {to:"hodder-entangled", type:"agree", note:"与《纠缠》一样把“物”放在关系过程中理解。"},
           {to:"levy-strauss-savage", type:"agree", note:"“拼贴匠”命题的另一条当代支线：制作即与材料的对话。"}
         ]}
      ]
    },
{
      id:"de-la-cadena", name:"玛丽索尔·德拉克鲁斯", en:"Marisol de la Cadena",
      born:1955, died:null, country:"秘鲁 / 美国", period:"contemp",
      bornApprox:true,
      branches:["theory", "political"], regions:["秘鲁安第斯"],
      tags:["本体论转向", "地球存在物", "宇宙政治"],
      summary:"安第斯研究与“本体论转向”的代表人物。她把山、河流等“地球存在物”当作政治行动者，追问在承认差异的同时如何共同行动。",
      statements:[
                {id:"cadena-earth-beings", key:true, year:2015, branch:"theory", work:"《地球存在物》",
         text:"“地球存在物”（tirakuna）与人是共同的政治行动者：民族志必须在不把它们化约为“信仰”的前提下写作。",
         links:[
           {to:"descola-ontology", type:"agree", note:"把本体论多元性带进具体的政治冲突现场。"},
           {to:"viveiros-perspectivism", type:"agree", note:"亚马逊视角主义在安第斯的对应经验。"}
         ]},
                {id:"cadena-cosmopolitics", key:true, year:2010, branch:"political", work:"《安第斯的原住民宇宙政治》",
         text:"宇宙政治：当“自然”作为行动者进入政治，冲突就不再只是人与人之间的利益分配。",
         links:[{to:"latour-gaia", type:"agree", note:"与拉图尔“非人进入政治”的命题直接呼应。"}]},
                {id:"cadena-partial-connections", year:2015, branch:"theory", work:"《地球存在物》",
         text:"不同世界之间的关系不是相对主义的并置，而是“部分的连接”：彼此只部分地相通，也因此需要共同翻译。",
         links:[
           {to:"strathern-gift", type:"agree", note:"借用斯特拉森“部分连接”的概念展开安第斯分析。"},
           {to:"kohn-forest", type:"agree", note:"与“超越人类的民族志”共同构成本体论转向的方法论。"}
         ]}
      ]
    },
{
      id:"kohn", name:"爱德华多·科恩", en:"Eduardo Kohn",
      born:1968, died:null, country:"美国 / 加拿大", period:"contemp",
      bornApprox:true,
      branches:["theory", "religion"], regions:["厄瓜多尔阿维拉"],
      tags:["超越人类", "符号学", "森林"],
      summary:"“超越人类的人类学”的代表。他借助皮尔士符号学，主张思考并非人类专有，森林本身也是一种符号与思想的过程。",
      statements:[
                {id:"kohn-dogs", key:true, year:2007, branch:"religion", work:"《狗如何做梦》",
         text:"阿维拉人的自我包含他者的视角：狗、美洲豹与人在梦中互相看见，主体性因此是关系性的。",
         links:[{to:"viveiros-perspectivism", type:"agree", note:"视角主义在亚马逊西部的经验例证。"}]},
                {id:"kohn-forest", key:true, year:2013, branch:"theory", work:"《森林如何思考》",
         text:"符号过程不限于人类：森林中的生物与河流同样参与“思考”，人类学因此应当走向超越人类的民族志。",
         links:[
           {to:"bateson-mind-nature", type:"agree", note:"“差异即信息”的符号学版本。"},
           {to:"descola-ontology", type:"agree", note:"本体论转向的另一条路径：从分类转向符号过程。"},
           {to:"latour-reassembling", type:"agree", note:"行动者网络理论在亚马逊雨林中的民族志实践。"}
         ]}
      ]
    },
{
      id:"haraway", name:"唐娜·哈拉维", en:"Donna Haraway",
      born:1944, died:null, country:"美国", period:"contemp",
      branches:["biological", "mind", "theory"], regions:["美国"],
      tags:["赛博格", "伴生种", "多物种", "情境化知识"],
      summary:"科学研究者与文化理论家，其“赛博格”“伴生种”“多物种”等概念深刻影响了人类学。她主张知识永远是具身的、位置的，人类必须与非人共同思考。",
      statements:[
                {id:"haraway-cyborg", key:true, year:1985, branch:"theory", work:"《赛博格宣言》",
         text:"赛博格打破人与机器、自然与文化的界线：它是政治想象，而不是技术预测。",
         links:[{to:"strathern-nature", type:"agree", note:"与《自然之后》同属对自然/文化二分的拆解。"}]},
                {id:"haraway-situated", key:true, year:1988, branch:"theory", work:"《情境化知识》",
         text:"客观性属于具身的、特定的立场；“上帝视角”只是没有标出位置的视角。",
         links:[
           {to:"abu-writing", type:"agree", note:"与“反文化书写”一样要求研究者交代自己的位置。"},
           {to:"rosaldo-r-culture-truth", type:"agree", note:"位置性与经验写作的同代命题。"}
         ]},
                {id:"haraway-companion", year:2003, branch:"biological", work:"《伴生种宣言》",
         text:"人与其伴生种（狗）共同演化：关系先于实体，“伴侣”是相互构成的存在方式。",
         links:[
           {to:"tsing-mushroom", type:"agree", note:"多物种民族志的理论来源之一。"},
           {to:"descola-naturalism", type:"agree", note:"都拒绝把非人当作纯粹的客体。"}
         ]},
                {id:"haraway-staying", year:2016, branch:"economic", work:"《与麻烦共存》",
         text:"人类世中要“与麻烦共处”：通过多物种的相互回应能力（response-ability）重建实践，而不是等待拯救。",
         links:[
           {to:"latour-gaia", type:"agree", note:"与盖亚命题同属人类世的政治想象。"},
           {to:"tsing-feral-atlas", type:"agree", note:"与“野性化”研究共享多物种问题域。"}
         ]}
      ]
    },
{
      id:"wagner", name:"罗伊·瓦格纳", en:"Roy Wagner",
      born:1938, died:2018, country:"美国", period:"interp",
      branches:["theory", "religion"], regions:["巴布亚新几内亚（达里比）"],
      tags:["文化的发明", "象征人类学", "达里比"],
      summary:"象征人类学的关键人物。他以“文化的发明”指出，文化是持续被创造出来的，人类学家的概念活动同样是一种发明。",
      statements:[
                {id:"wagner-daribi", year:1972, branch:"religion", work:"《哈布：达里比宗教中意义的创新》",
         text:"意义的创新：宗教象征在具体情境中被即兴使用与改写，而不是一套固定信条。",
         links:[{to:"wagner-invention", type:"agree", note:"“发明”命题的民族志基础。"}]},
                {id:"wagner-invention", key:true, year:1975, branch:"theory", work:"《文化的发明》",
         text:"文化是持续被发明的：研究者与被研究者都在发明意义，人类学因此必然是自我反思的。",
         links:[
           {to:"strathern-gift", type:"agree", note:"与美拉尼西亚研究中“关系性”视角相互支撑。"},
           {to:"clifford-predicament", type:"agree", note:"与《写文化》一代对民族志写作的反思相通。"},
           {to:"geertz-interpretation", type:"disagree", note:"批评“意义之网”的隐喻过于静态，忽视了意义的创造过程。"}
         ]},
                {id:"wagner-symbols", key:true, year:1986, branch:"religion", work:"《自我指涉的象征》",
         text:"象征指向自身而非别的东西：不能再用另一套符号去“翻译”象征，只能参与它的用法。",
         links:[{to:"turner-symbols", type:"disagree", note:"与特纳的象征分析分歧：象征并非指向别的意义的工具。"}]}
      ]
    },
{
      id:"rosaldo-r", name:"雷纳托·罗萨尔多", en:"Renato Rosaldo",
      born:1941, died:null, country:"美国", period:"contemp",
      branches:["theory", "mind"], regions:["菲律宾吕宋（伊隆戈）"],
      tags:["位置性", "情感", "文化与真理"],
      summary:"人类学写作反思的代表人物。他主张知识是“有位置的”，并把分析者自身的丧痛经验带入对伊隆戈人情感的理解。",
      statements:[
                {id:"rosaldo-r-ilongot", year:1980, branch:"political", work:"《伊隆戈人的猎头：1883—1974》",
         text:"猎头不是“原始习俗”，而是历史中的政治行动：它在世代、仇恨与联盟的变动中被使用。",
         links:[{to:"sahlins-islands", type:"agree", note:"与“历史之岛”一样拒绝对无国家社会做非历史的描述。"}]},
                {id:"rosaldo-r-grief", key:true, year:1989, branch:"mind", work:"《哀悼与猎头者的愤怒》",
         text:"分析者的丧痛经验可以成为理解他者情感的资源：研究者的位置不是污染，而是知识条件。",
         links:[
           {to:"rosaldo-passion", type:"agree", note:"与米歇尔·罗萨尔多的情感人类学同属一个转向。"},
           {to:"behar-vulnerable-observer", type:"agree", note:"为“脆弱的民族志”提供了著名范例。"}
         ]},
                {id:"rosaldo-r-culture-truth", key:true, year:1989, branch:"theory", work:"《文化与真理》",
         text:"反对“经典民族志”的客观主义：人类学知识具有位置性，应把经验与权力放回写作之中。",
         links:[
           {to:"clifford-authority", type:"agree", note:"与《论民族志权威》共同构成 1980 年代的反思路线。"},
           {to:"geertz-local-knowledge", type:"agree", note:"同样强调人类学知识的处境性。"}
         ]}
      ]
    },
{
      id:"willis", name:"保罗·威利斯", en:"Paul Willis",
      born:1945, died:null, country:"英国", period:"contemp",
      branches:["mind", "theory"], regions:["英国（汉默镇）"],
      tags:["文化再生产", "反学校文化", "民族志"],
      summary:"教育民族志与文化研究的代表。他以《学做工》说明工人阶级子弟的抵抗文化反而把自己再生产为工人阶级。",
      statements:[
                {id:"willis-learning", key:true, year:1977, branch:"mind", work:"《学做工》",
         text:"“反学校文化”：工人阶级子弟的抵抗与男子气概表演，反而把他们导向工厂劳动——这是文化再生产。",
         links:[
           {to:"bourdieu-reproduction", type:"agree", note:"为“再生产”理论提供了经验与文化维度的证据。"},
           {to:"taussig-devil", type:"agree", note:"同样关注被支配者的文化创造与其中的悖论。"}
         ]},
                {id:"willis-ethnographic-imagination", key:true, year:2000, branch:"theory", work:"《民族志的想象力》",
         text:"民族志是一种理论与美学实践：要捕捉日常文化中的“诗意”与创造性。",
         links:[{to:"clifford-authority", type:"agree", note:"与民族志写作反思同路。"}]}
      ]
    },
{
      id:"das", name:"维娜·达斯", en:"Veena Das",
      born:1945, died:null, country:"印度", period:"contemp",
      branches:["political", "mind"], regions:["印度（德里、旁遮普）"],
      tags:["暴力", "日常", "沉默"],
      summary:"暴力与日常生活的关键研究者。她追问暴力之后生活如何继续：恢复不在于创伤叙事，而在于日常的细微实践。",
      statements:[
                {id:"das-critical-events", key:true, year:1995, branch:"political", work:"《关键事件》",
         text:"关键事件（分治、暴动）改写常识：国家与社群的关系在事件中被重新组织，日常生活中断了又延续。",
         links:[{to:"gupta-state", type:"agree", note:"与“国家的人类学”一样关注国家在日常生活里的存在方式。"}]},
                {id:"das-violence", key:true, year:2007, branch:"mind", work:"《生活与词语》",
         text:"暴力之后，生活如何继续？恢复不是在创伤叙事中完成，而是在日常的细小实践里。",
         links:[
           {to:"taussig-defacement", type:"agree", note:"与“公共秘密”一样处理知道与不能说之间的关系。"},
           {to:"kleinman-social-suffering", type:"agree", note:"苦难研究的另一支：从社会苦难到日常恢复。"}
         ]},
                {id:"das-violence-subjectivity", year:2000, branch:"political", work:"《暴力与主体性》（合编）",
         text:"暴力研究应关注主体性：痛苦、责任与语言如何在暴力中被重新形成。",
         links:[
           {to:"farmer-violence", type:"agree", note:"与“结构性暴力”互补：结构条件与主体经验需要一起分析。"},
           {to:"luhrmann-mind", type:"agree", note:"都主张把内在经验的塑造放回社会条件中理解。"}
         ]}
      ]
    },
{
      id:"fassin", name:"迪迪埃·法桑", en:"Didier Fassin",
      born:1956, died:null, country:"法国", period:"contemp",
      branches:["political", "mind"], regions:["法国", "南非", "塞内加尔"],
      tags:["道德人类学", "警察", "创伤"],
      summary:"道德人类学与批判社会研究的代表。他研究国家如何通过道德范畴（同情、创伤、危险）区分人群，并做过法国警察的民族志。",
      statements:[
                {id:"fassin-trauma", key:true, year:2007, branch:"mind", work:"《创伤的帝国》",
         text:"“创伤”成为当代苦难的通用语言：它使苦难获得承认，也可能把政治问题转化为心理问题。",
         links:[{to:"kleinman-neurasthenia", type:"agree", note:"同样的关切：诊断范畴如何被文化条件塑造。"}]},
                {id:"fassin-police", year:2011, branch:"political", work:"《秩序的力量》",
         text:"警察是国家暴力的日常形式：区分性的执法把“下等阶层”制造出来。",
         links:[
           {to:"gupta-state", type:"agree", note:"国家人类学的另一现场：街头与执法。"},
           {to:"wolf-envisioning", type:"agree", note:"把结构性权力落到具体的行政与执法实践中。"}
         ]},
                {id:"fassin-moral", key:true, year:2012, branch:"theory", work:"《道德人类学》",
         text:"道德人类学：把道德当作社会实践来研究——人们如何判断、如何被判断，而不是哲学家式的规范论证。",
         links:[
           {to:"das-violence-subjectivity", type:"agree", note:"共享对人类苦难与伦理的判断问题的关注。"},
           {to:"kleinman-social-suffering", type:"agree", note:"与医学人类学的道德问题意识互补。"}
         ]}
      ]
    },
{
      id:"herzfeld", name:"迈克尔·赫茨菲尔德", en:"Michael Herzfeld",
      born:1946, died:null, country:"英国 / 美国", period:"contemp",
      branches:["political", "theory"], regions:["希腊（克里特）", "泰国"],
      tags:["文化亲密性", "官僚", "诗学"],
      summary:"以“文化亲密性”和“冷漠的社会生产”著称。他把国家当作日常实践来研究，关注羞辱、表演与官僚如何共同构成国家。",
      statements:[
                {id:"herzfeld-poetics", year:1985, branch:"theory", work:"《男子气概的诗学》",
         text:"克里特山村的荣誉与自我表现：文化是表演性的，人们以机智与“戏耍”应对权力。",
         links:[
           {to:"geertz-interpretation", type:"agree", note:"解释取向的延续：把社会行动读作可解读的表演。"},
           {to:"ortner-everest", type:"agree", note:"同样关注男性气质与竞争性价值的再生产。"}
         ]},
                {id:"herzfeld-indifference", key:true, year:1992, branch:"political", work:"《冷漠的社会生产》",
         text:"官僚的“冷漠”不是官僚个人的品质，而是国家通过范畴化与程序生产出来的效果。",
         links:[
           {to:"gupta-state", type:"agree", note:"与“国家作为文化实践”的取向一致。"},
           {to:"fassin-police", type:"agree", note:"行政与执法的日常研究相互印证。"}
         ]},
                {id:"herzfeld-intimacy", key:true, year:1997, branch:"political", work:"《文化亲密性》",
         text:"文化亲密性：民族国家把那些令人尴尬的自我特征留在内部，对外则呈现体面的形象。",
         links:[
           {to:"abu-dramas", type:"agree", note:"同为对国家想象与媒介政治的研究。"},
           {to:"mintz-afro-american", type:"disagree", note:"批评：以“国族”为文化亲密性的容器，可能掩盖跨国与离散的经验。"}
         ]}
      ]
    },
{
      id:"gupta", name:"阿基尔·古普塔", en:"Akhil Gupta",
      born:1959, died:null, country:"印度 / 美国", period:"contemp",
      branches:["political", "global"], regions:["印度北部", "美国"],
      tags:["国家人类学", "官僚", "结构性暴力"],
      summary:"国家人类学的推动者。他强调国家不是既定实体，而是通过文书、腐败话语与日常实践不断被想象与再生产的东西。",
      statements:[
                {id:"gupta-state", key:true, year:1995, branch:"political", work:"《模糊的边界》",
         text:"国家不是统一的实体：通过腐败话语与日常实践，“国家”被想象、被争夺、也被再生产。",
         links:[
           {to:"trouillot-global", type:"agree", note:"与特鲁约一样要求放弃把国家当作既定分析单位。"},
           {to:"das-critical-events", type:"agree", note:"国家在关键事件与日常之间的存在方式。"}
         ]},
                {id:"gupta-anthropology-of-state", year:2006, branch:"theory", work:"《国家人类学读本》（合编）",
         text:"国家应当被当作文化实践与效果来研究，而不是研究的前提。",
         links:[{to:"gupta-state", type:"agree", note:"把这一立场整理为研究纲领。"}]},
                {id:"gupta-red-tape", key:true, year:2012, branch:"political", work:"《红头文件》",
         text:"文书与程序把贫困转化为个人的失败：结构性暴力在官僚的日常操作中被自然化。",
         links:[
           {to:"farmer-violence", type:"agree", note:"与结构暴力概念的经验呼应。"},
           {to:"fassin-police", type:"agree", note:"同属“国家实践的民族志”。"}
         ]}
      ]
    },
{
      id:"trouillot", name:"米歇尔-罗尔夫·特鲁约", en:"Michel-Rolph Trouillot",
      born:1949, died:2012, country:"海地 / 美国", period:"contemp",
      branches:["global", "political"], regions:["海地", "加勒比"],
      tags:["历史与权力", "沉默", "全球人类学"],
      summary:"海地历史学家与人类学家。他以《沉默的过去》说明历史是被生产出来的，并主张人类学的对象是“他者性”的全球生产。",
      statements:[
                {id:"trouillot-haiti", year:1990, branch:"political", work:"《国家反对民族》",
         text:"海地的国家与农民社会长期对立：国家并不是民族的代表，而是与民族分离的权力装置。",
         links:[{to:"mintz-worker", type:"agree", note:"与加勒比种植园社会的阶级分析相互支撑。"}]},
                {id:"trouillot-silencing", key:true, year:1995, branch:"global", work:"《沉默的过去》",
         text:"历史是被生产出来的：权力决定哪些事实被叙述、哪些被沉默——海地革命长期“不可想象”即是例证。",
         links:[
           {to:"wolf-history", type:"agree", note:"与“没有历史的人民”同属对历史书写的批判。"},
           {to:"mintz-caribbean", type:"agree", note:"共同的加勒比视角：把边缘写入世界历史。"}
         ]},
                {id:"trouillot-global", key:true, year:2003, branch:"theory", work:"《全球转型》",
         text:"人类学的对象不是孤立的村庄，而是“他者性”在全球关系中的生产。",
         links:[
           {to:"marcus-multisited", type:"agree", note:"与多点民族志的问题意识一致。"},
           {to:"appadurai-global", type:"agree", note:"全球化研究中的另一种方法论表述。"}
         ]}
      ]
    },
{
      id:"newton", name:"埃斯特·牛顿", en:"Esther Newton",
      born:1940, died:null, country:"美国", period:"contemp",
      branches:["mind", "theory"], regions:["美国（纽约、火岛）"],
      tags:["性别表演", "酷儿民族志", "社群"],
      summary:"性别与性少数研究的先驱民族志作者。她研究男扮女装表演与性少数社群空间，把“表演”带入性别研究。",
      statements:[
                {id:"newton-mother-camp", key:true, year:1972, branch:"mind", work:"《母亲营地》",
         text:"男扮女装者的台上台下显示：性别是一种模仿性的表演，而非稳定的内在本质。",
         links:[
           {to:"rubin-sex", type:"agree", note:"与《思考性》同属把性少数社群当作严肃研究对象的路线。"},
           {to:"rubin-deviations", type:"agree", note:"共同的立场：性社群有自己的历史与制度。"}
         ]},
                {id:"newton-cherry-grove", key:true, year:1993, branch:"mind", work:"《樱桃林》",
         text:"性少数社群的空间史：度假社区如何成为共同体的场所，又如何被阶级与性别分层。",
         links:[{to:"newton-mother-camp", type:"agree", note:"从表演转向社群与空间。"}]},
                {id:"newton-butch", year:2018, branch:"theory", work:"《我的 T 生涯》",
         text:"自传式的酷儿人类学：研究者的性/别经验本身就是知识的位置。",
         links:[{to:"rosaldo-r-culture-truth", type:"agree", note:"与“位置性”写作的呼应。"}]}
      ]
    },
{
      id:"stoler", name:"安·劳拉·斯托勒", en:"Ann Laura Stoler",
      born:1950, died:null, country:"美国", period:"contemp",
      branches:["global", "political"], regions:["印尼（苏门答腊）", "荷兰殖民档案"],
      tags:["殖民研究", "档案", "亲密关系"],
      summary:"殖民研究与历史人类学的代表。她揭示殖民统治如何通过亲密关系、性与家庭秩序运作，并主张重新阅读殖民档案。",
      statements:[
                {id:"stoler-intimacies", key:true, year:2002, branch:"political", work:"《肉体的知识与帝国权力》",
         text:"殖民统治通过亲密关系的治理运作：种族与性别的范畴在家庭、育儿与日常安排中被生产出来。",
         links:[
           {to:"taussig-shamanism", type:"agree", note:"共同关注殖民暴力及其文化内化。"},
           {to:"abu-writing", type:"agree", note:"与反思他者化书写的路线相通。"}
         ]},
                {id:"stoler-archives", key:true, year:2009, branch:"theory", work:"《沿着档案的纹理》",
         text:"档案不是中立的史料：要读“档案的纹理”——殖民国家的焦虑、犹豫与分类冲动都留在其中。",
         links:[
           {to:"fabian-language", type:"agree", note:"与殖民语言政治的档案研究同路。"},
           {to:"asad-genealogy", type:"agree", note:"谱系学方法在殖民档案中的运用。"}
         ]},
                {id:"stoler-duress", year:2016, branch:"global", work:"《困境》",
         text:"帝国遗产的延续：殖民造成的“困境”至今塑造着当代的制度与感受力。",
         links:[
           {to:"stoler-intimacies", type:"agree", note:"把殖民分析延伸到当代。"},
           {to:"wolf-envisioning", type:"agree", note:"共同的关切：结构性的历史权力在当代的持续。"}
         ]}
      ]
    },
{
      id:"miller-d", name:"丹尼尔·米勒", en:"Daniel Miller",
      born:1954, died:null, country:"英国", period:"contemp",
      branches:["economic", "global"], regions:["特立尼达", "印度", "伦敦"],
      tags:["物质文化", "数字人类学", "消费"],
      summary:"物质文化与数字人类学的代表。他主张物与人是相互构成的，并主持了全球九地的社交媒体比较研究。",
      statements:[
                {id:"miller-things", key:true, year:1987, branch:"economic", work:"《物质文化与大众消费》",
         text:"物与人是相互构成的：消费不是浪费与异化，而是社会关系的展开与自我塑造。",
         links:[{to:"appadurai-things", type:"agree", note:"与“物的社会生命”同属物的转向。"}]},
                {id:"miller-stuff", year:2010, branch:"economic", work:"《东西》",
         text:"平凡之物最值得研究：手机、服装、家具如何构成“我们是谁”。",
         links:[{to:"hodder-entangled", type:"agree", note:"与考古学的纠缠理论共享“物参与构成人”的立场。"}]},
                {id:"miller-tales-facebook", key:true, year:2011, branch:"global", work:"《Facebook 的故事》",
         text:"数字媒介的民族志：特立尼达的 Facebook 使用被既有的亲属与邻里关系“驯化”，而非相反。",
         links:[{to:"boellstorff-second-life", type:"agree", note:"与虚拟世界研究共同建立数字民族志的方法。"}]},
                {id:"miller-social-media", year:2016, branch:"global", work:"《社交媒体如何改变世界》",
         text:"全球九地比较显示：社交媒体的形态与后果由社会关系与制度决定，而不是由技术本身决定。",
         links:[
           {to:"appadurai-global", type:"agree", note:"全球化研究在数字媒介领域的经验检验。"},
           {to:"miller-tales-facebook", type:"agree", note:"比较框架的延伸。"}
         ]}
      ]
    },
{
      id:"boellstorff", name:"汤姆·贝尔斯托夫", en:"Tom Boellstorff",
      born:1961, died:null, country:"美国", period:"contemp",
      bornApprox:true,
      branches:["global", "theory"], regions:["印尼", "Second Life"],
      tags:["数字人类学", "虚拟世界", "酷儿"],
      summary:"数字人类学的奠基者之一。他在虚拟世界《第二人生》中做田野，主张线上世界同样是真实的文化场所。",
      statements:[
                {id:"boellstorff-archipelago", key:true, year:2005, branch:"mind", work:"《同性恋群岛》",
         text:"印尼男同性恋社群的“共同体”不是西方模式的复制：他们通过“配音文化”创造自己的性别与国族位置。",
         links:[{to:"newton-mother-camp", type:"agree", note:"与性少数社群研究同路，但强调非西方的在地创造。"}]},
                {id:"boellstorff-second-life", key:true, year:2008, branch:"theory", work:"《在第二人生中》",
         text:"虚拟世界是真实的田野：线上社群有文化、经济与身份政治，值得完整的人类学研究。",
         links:[
           {to:"miller-tales-facebook", type:"agree", note:"数字民族志的两种示范。"},
           {to:"coleman-anonymous", type:"agree", note:"同为线上政治与社群的研究。"}
         ]},
                {id:"boellstorff-methods", year:2012, branch:"theory", work:"《虚拟世界民族志》（合著）",
         text:"数字田野的方法论：参与观察、伦理与研究者身份如何迁移到线上世界。",
         links:[{to:"boellstorff-second-life", type:"agree", note:"方法论的规范化总结。"}]}
      ]
    },
{
      id:"coleman", name:"加布里埃拉·科尔曼", en:"Gabriella Coleman",
      born:1973, died:null, country:"美国 / 加拿大", period:"contemp",
      branches:["global", "political"], regions:["线上", "美国"],
      tags:["黑客文化", "数字政治", "Anonymous"],
      summary:"黑客与数字政治的民族志作者。她研究自由软件伦理与 Anonymous，说明线上行动主义同样有丰富的文化与实践逻辑。",
      statements:[
                {id:"coleman-coding-freedom", key:true, year:2013, branch:"political", work:"《编码自由》",
         text:"自由软件的黑客伦理：协作、法律文化与“自由”的技术政治构成一种道德实践。",
         links:[{to:"miller-social-media", type:"agree", note:"数字实践需要被放回文化与制度中理解。"}]},
                {id:"coleman-anonymous", key:true, year:2014, branch:"political", work:"《匿名者》",
         text:"Anonymous 的民族志：松散的线上集体如何产生行动力、表演性与政治后果。",
         links:[
           {to:"boellstorff-second-life", type:"agree", note:"同属线上世界的深度田野。"},
           {to:"coleman-coding-freedom", type:"agree", note:"从黑客伦理到政治行动的一线之隔。"}
         ]}
      ]
    },
{
      id:"lock", name:"玛格丽特·洛克", en:"Margaret Lock",
      born:1946, died:null, country:"加拿大", period:"contemp",
      branches:["mind", "biological"], regions:["日本", "北美"],
      tags:["地方生物学", "脑死亡", "医学人类学"],
      summary:"医学人类学的代表。她以日本与北美的比较研究提出“地方生物学”，说明生物过程与文化意义相互塑造。",
      statements:[
                {id:"lock-local-biology", key:true, year:1993, branch:"mind", work:"《与衰老相遇》",
         text:"“地方生物学”：更年期的身体经验与医学解释在不同社会中被不同地建构，不能以北美范式通约。",
         links:[
           {to:"kleinman-neurasthenia", type:"agree", note:"同样的方法论：症状与诊断的文化条件。"},
           {to:"kleinman-models", type:"agree", note:"解释模型理论在衰老与性别问题上的延伸。"}
         ]},
                {id:"lock-twice-dead", key:true, year:2002, branch:"biological", work:"《两次死亡》",
         text:"脑死亡在日本与北美被不同地接受：死亡的定义是生物医学、法律与文化协商的产物。",
         links:[
           {to:"lock-local-biology", type:"agree", note:"“地方生物学”概念最有力的案例。"},
           {to:"haraway-situated", type:"agree", note:"科学知识的位置性在临床中的体现。"}
         ]},
                {id:"lock-biomedicine", year:2010, branch:"mind", work:"《生物医学人类学》（合著）",
         text:"把生物医学本身当作文化与实践来研究：实验室、临床与公共卫生都是民族志的场地。",
         links:[{to:"fassin-trauma", type:"agree", note:"与批判医学人类学共享问题意识。"}]}
      ]
    },
{
      id:"martin-e", name:"艾米莉·马丁", en:"Emily Martin",
      born:1944, died:null, country:"美国", period:"contemp",
      branches:["mind", "biological"], regions:["美国"],
      tags:["身体", "免疫学", "隐喻"],
      summary:"身体与医学人类学的代表。她分析医学话语中的隐喻，说明身体观如何随社会结构变化。",
      statements:[
                {id:"martin-woman-body", key:true, year:1987, branch:"mind", work:"《身体中的女人》",
         text:"女性对月经、分娩与更年期的叙述被医学隐喻（生产、机器、失败）塑造：身体经验带上了社会结构的印记。",
         links:[
           {to:"lock-local-biology", type:"agree", note:"与“地方生物学”并行：身体经验的文化建构。"},
           {to:"kleinman-models", type:"agree", note:"医学解释模型研究的另一个方向。"}
         ]},
                {id:"martin-immune", key:true, year:1994, branch:"biological", work:"《灵活的躯体》",
         text:"免疫系统的话语从“防御国家”转向“灵活适应”：身体隐喻的变化与美国经济从福特主义到灵活积累的变化同步。",
         links:[
           {to:"martin-woman-body", type:"agree", note:"同一方法：通过隐喻分析连接身体观与社会结构。"},
           {to:"haraway-situated", type:"agree", note:"科学话语的社会史分析。"}
         ]}
      ]
    },
{
      id:"luhrmann", name:"坦尼娅·卢尔曼", en:"Tanya Luhrmann",
      born:1959, died:null, country:"美国", period:"contemp",
      branches:["mind", "religion"], regions:["美国", "加纳", "印度"],
      tags:["心理人类学", "宗教经验", "注意力"],
      summary:"心理人类学的代表。她研究巫术实践者、美国精神病学与福音派基督徒，主张宗教经验是可以通过训练获得的能力。",
      statements:[
                {id:"luhrmann-persuasion", year:1989, branch:"mind", work:"《说服的技艺》",
         text:"巫术实践者不是先相信再实践，而是在参与中“学会看见”：信念由实践与社群训练生成。",
         links:[
           {to:"evans-pritchard-witchcraft", type:"agree", note:"把巫术研究从合理性之争转向经验的形成过程。"},
           {to:"luhrmann-when-god-talks-back", type:"agree", note:"同一问题的另一田野。"}
         ]},
                {id:"luhrmann-mind", key:true, year:2000, branch:"mind", work:"《两种心灵》",
         text:"美国精神病学中生物医学与心理治疗两套范式并存，它们对“治愈”和“人”的理解并不一致。",
         links:[{to:"kleinman-models", type:"agree", note:"解释模型的分歧在专业体系内部的展现。"}]},
                {id:"luhrmann-when-god-talks-back", key:true, year:2012, branch:"religion", work:"《当上帝回应时》",
         text:"福音派基督徒训练注意力与内在对话，使上帝成为可以真实感知的对象。",
         links:[
           {to:"luhrmann-mind", type:"agree", note:"把心理人类学方法用于宗教经验。"},
           {to:"asad-islam", type:"disagree", note:"阿萨德强调宗教是历史性的“话语传统”，而心理学取向更关注个体的可训练经验，两者在方法论上分歧。"}
         ]},
                {id:"luhrmann-how-god-becomes-real", year:2020, branch:"religion", work:"《上帝如何变得真实》",
         text:"真实感来自“注意力”与“仿佛”（as-if）的实践：宗教经验是可练习、可培养的能力。",
         links:[{to:"luhrmann-when-god-talks-back", type:"agree", note:"理论总结。"}]}
      ]
    },
{
      id:"farmer", name:"保罗·法默", en:"Paul Farmer",
      born:1959, died:2022, country:"美国", period:"contemp",
      branches:["global", "mind"], regions:["海地", "卢旺达", "秘鲁"],
      tags:["结构性暴力", "全球健康", "人权"],
      summary:"医学人类学家与全球健康行动者。他以“结构性暴力”解释疾病与贫困的不平等分布，主张治疗即见证。",
      statements:[
                {id:"farmer-aids", year:1992, branch:"global", work:"《艾滋病与指责》",
         text:"疾病与污名：海地与海地人的艾滋病叙事如何被政治与媒体生产，而不是由病毒单独决定。",
         links:[
           {to:"mintz-caribbean", type:"agree", note:"共同把加勒比放进世界政治经济关系中理解。"},
           {to:"fassin-trauma", type:"agree", note:"同样的关怀：疾病范畴的道德与政治负荷。"}
         ]},
                {id:"farmer-violence", key:true, year:2004, branch:"political", work:"《结构性暴力的人类学》",
         text:"结构性暴力：贫困与疾病的不平等分布是制度与历史造成的结果，不是文化或个体的失败。",
         links:[
           {to:"kleinman-social-suffering", type:"agree", note:"与“社会苦难”研究直接相连。"},
           {to:"das-violence-subjectivity", type:"agree", note:"结构条件与主体经验的互补分析。"},
           {to:"gupta-red-tape", type:"agree", note:"官僚实践如何生产结构性暴力。"}
         ]},
                {id:"farmer-pathologies", key:true, year:2003, branch:"global", work:"《权力的病理学》",
         text:"健康权是人权：医疗实践应当成为见证与行动，而不只是描述。",
         links:[
           {to:"farmer-violence", type:"agree", note:"从分析走向实践主张。"},
           {to:"kleinman-caregiving", type:"agree", note:"与照护伦理的研究相互呼应。"}
         ]}
      ]
    },
{
      id:"hrdy", name:"莎拉·布拉弗·赫迪", en:"Sarah Blaffer Hrdy",
      born:1946, died:null, country:"美国", period:"contemp",
      branches:["biological", "mind"], regions:["印度", "非洲", "美国"],
      tags:["女性策略", "合作育儿", "性选择"],
      summary:"灵长类学与人类演化研究的代表。她以女性灵长类与母职的策略性行为，修正了以男性活动为中心的进化叙事。",
      statements:[
                {id:"hrdy-woman", key:true, year:1981, branch:"biological", work:"《从不进化的女人》",
         text:"女性灵长类有竞争、联盟与策略性行为：以被动、非竞争性女性为前提的进化叙事需要被推翻。",
         links:[
           {to:"washburn-hunting", type:"disagree", note:"直接挑战以男性狩猎为中心的进化模型。"},
           {to:"goodall-window", type:"agree", note:"以长期野外观察为证据基础。"}
         ]},
                {id:"hrdy-mother-nature", year:1999, branch:"biological", work:"《母性》",
         text:"母性不是本能，而是随资源与社会支持变化的投资策略。",
         links:[{to:"hrdy-woman", type:"agree", note:"概念的延伸：从性选择到母职决策。"}]},
                {id:"hrdy-mothers-others", key:true, year:2009, branch:"biological", work:"《母亲与他者》",
         text:"合作育儿：人类婴儿由多人共同抚养，这一安排是人类脑量扩张与生育策略的关键条件。",
         links:[
           {to:"hrdy-mother-nature", type:"agree", note:"理论收束：把母职放回社群。"},
           {to:"mead-newguinea", type:"agree", note:"与文化人类学的养育研究可以对话。"}
         ]}
      ]
    },
{
      id:"paabo", name:"斯万特·帕博", en:"Svante Pääbo",
      born:1955, died:null, country:"瑞典", period:"contemp",
      branches:["biological", "archaeology"], regions:["德国（莱比锡）", "西伯利亚"],
      tags:["古 DNA", "尼安德特人", "丹尼索瓦人"],
      summary:"古遗传学的创立者。他建立了古代 DNA 的研究方法，并证明现代人类与尼安德特人、丹尼索瓦人之间存在基因交流。",
      statements:[
                {id:"paabo-ancient-dna", key:true, year:1997, branch:"biological", work:"《尼安德特人线粒体 DNA 序列》",
         text:"古 DNA 方法：从古代骨骼中提取遗传物质，把遗传学变成人类起源研究的独立证据线。",
         links:[{to:"leakey-olduvai", type:"agree", note:"与古生物学证据共同构成人类起源的多线研究。"}]},
                {id:"paabo-denisova", year:2010, branch:"biological", work:"《丹尼索瓦人的线粒体基因组》",
         text:"仅凭基因组即可识别未知的古代人群：丹尼索瓦人的发现说明化石与遗传证据可以互相补充。",
         links:[
           {to:"paabo-ancient-dna", type:"agree", note:"方法应用的里程碑。"},
           {to:"cann-mitochondrial-eve", type:"agree", note:"分子人类学的另一条证据线。"}
         ]},
                {id:"paabo-neanderthal-man", key:true, year:2014, branch:"biological", work:"《尼安德特人》",
         text:"尼安德特人与现代人类曾发生杂交：人类演化是网状而非单一的树状谱系。",
         links:[
           {to:"cann-mitochondrial-eve", type:"disagree", note:"杂交证据显示“完全替代”模型过于简单。"},
           {to:"montagu-concept-race", type:"agree", note:"基因组证据同样不支持把人群区分为固定类型。"}
         ]}
      ]
    },
{
      id:"leakey-m", name:"玛丽·利基", en:"Mary Leakey",
      born:1913, died:1996, country:"英国 / 肯尼亚", period:"contemp",
      branches:["biological", "archaeology"], regions:["坦桑尼亚（奥杜威、莱托利）"],
      tags:["早期人类", "足迹", "发掘"],
      summary:"东非早期人类研究的奠基者。她主持奥杜威峡谷发掘并发现莱托利的直立行走足迹，改写了人类起源的时间表。",
      statements:[
                {id:"leakey-olduvai", key:true, year:1979, branch:"archaeology", work:"《奥杜威峡谷：我对早期人类的探索》",
         text:"长期发掘与多学科合作：早期人类的工具、居所与生活方式需要地层、动物群与地质证据共同支撑。",
         links:[{to:"binford-bones", type:"agree", note:"与遗址形成过程的埋藏学分析一致。"}]},
                {id:"leakey-laetoli", key:true, year:1979, branch:"biological", work:"《莱托利的上新世足迹》",
         text:"三百六十万年前的直立行走足迹：两足行走远早于工具制作与脑量扩张。",
         links:[
           {to:"leakey-olduvai", type:"agree", note:"同一研究传统中的关键发现。"},
           {to:"washburn-hunting", type:"disagree", note:"以狩猎解释人类进化起源的假说因此需要修正。"}
         ]}
      ]
    },
{
      id:"cann", name:"丽贝卡·坎恩", en:"Rebecca Cann",
      born:1951, died:null, country:"美国", period:"contemp",
      branches:["biological"], regions:["美国（夏威夷）"],
      tags:["线粒体夏娃", "分子人类学"],
      summary:"分子人类学的代表。她与威尔逊等人以线粒体 DNA 变异提出“线粒体夏娃”，支持现代人类起源于非洲的模型。",
      statements:[
                {id:"cann-mitochondrial-eve", key:true, year:1987, branch:"biological", work:"《线粒体 DNA 与人类进化》",
         text:"全球人群的线粒体 DNA 变异指向约二十万年前非洲的共同祖先：现代人类起源有了分子证据。",
         links:[{to:"washburn-newphys", type:"agree", note:"体质人类学与分子证据结合的转折点。"}]},
                {id:"cann-molecular-clock", key:true, year:1987, branch:"biological", work:"《线粒体 DNA 与人类进化》",
         text:"分子钟方法：用 DNA 差异估计人群分化时间，为人类学提供可以独立检验的时间尺度。",
         links:[
           {to:"cann-mitochondrial-eve", type:"agree", note:"同一研究的方法论侧面。"},
           {to:"paabo-ancient-dna", type:"agree", note:"分子人类学的两条证据线。"}
         ]}
      ]
    },
{
      id:"flannery", name:"肯特·弗兰纳里", en:"Kent Flannery",
      born:1934, died:null, country:"美国", period:"contemp",
      branches:["archaeology", "economic"], regions:["近东", "墨西哥瓦哈卡"],
      tags:["广谱革命", "早期农业", "村落考古"],
      summary:"早期农业与村落社会考古的权威。他提出“广谱革命”，说明农业之前先有对多种资源的广泛利用。",
      statements:[
                {id:"flannery-broad-spectrum", key:true, year:1969, branch:"archaeology", work:"《早期驯化的起源与生态效应》",
         text:"广谱革命：在农业出现之前，人群先扩大对多种野生资源的利用；人口压力与资源波动促成了驯化。",
         links:[
           {to:"childe-neolithic", type:"disagree", note:"新石器革命不是单一事件，而是区域差异明显的长期过程。"},
           {to:"binford-nunamiut", type:"agree", note:"与民族考古学一样重视从当代行为推断遗存意义。"}
         ]},
                {id:"flannery-mesoamerican-village", key:true, year:1976, branch:"archaeology", work:"《早期中美洲村落》（主编）",
         text:"用居住单元与家庭尺度分析早期村落：考古学的大问题需要小尺度的细致证据。",
         links:[
           {to:"flannery-broad-spectrum", type:"agree", note:"把生态解释落到具体的居住与生计材料上。"},
           {to:"hodder-domestication", type:"agree", note:"共同关注早期村落生活的组织方式。"}
         ]}
      ]
    },
{
      id:"behar", name:"露丝·贝哈尔", en:"Ruth Behar",
      born:1956, died:null, country:"古巴 / 美国", period:"contemp",
      branches:["mind", "theory"], regions:["古巴", "墨西哥"],
      tags:["脆弱性", "自传民族志", "位置"],
      summary:"反思性民族志的代表。她主张研究者的情感与个人经验不应被排除在民族志之外，写作本身即知识的一部分。",
      statements:[
                {id:"behar-translated-woman", key:true, year:1993, branch:"mind", work:"《翻译中的女人》",
         text:"讲述者与研究者之间的权力关系：把访谈对象的声音与研究者的处境一同写进文本。",
         links:[{to:"abu-writing", type:"agree", note:"与“反文化书写”同样拒绝单方面的他者叙述。"}]},
                {id:"behar-vulnerable-observer", key:true, year:1996, branch:"theory", work:"《脆弱的观察者》",
         text:"脆弱性不是研究的缺陷：情感、丧痛与个人经验是理解他者的知识条件。",
         links:[
           {to:"rosaldo-r-culture-truth", type:"agree", note:"与“位置性”写作直接呼应。"},
           {to:"newton-butch", type:"agree", note:"同属把研究者自身经验写入文本的路线。"},
           {to:"behar-translated-woman", type:"agree", note:"同一主张的写作实践版。"}
         ]}
      ]
    },
{
      id:"wang-mingming", name:"王铭铭", en:"Wang Mingming",
      born:1962, died:null, country:"中国", period:"contemp",
      branches:["theory", "religion"], regions:["福建", "中国"],
      tags:["历史人类学", "汉人社会", "他者"],
      summary:"中国历史人类学与“中国人类学”讨论的代表。他主张把汉人村落放进国家与长时段历史中理解，并反思中国自身的他者化传统。",
      statements:[
                {id:"wang-community-xi", key:true, year:1997, branch:"religion", work:"《社区的历程》",
         text:"福建溪村的家族史：村落不是自足的共同体，它的仪礼与秩序要放在国家与长时段历史中理解。",
         links:[
           {to:"fei-peasant", type:"agree", note:"接续社区研究，但更强调历史与国家维度。"},
           {to:"lin-golden", type:"agree", note:"与汉人家族研究传统相连。"}
         ]},
                {id:"wang-anthropology-china", year:1997, branch:"theory", work:"《社会人类学与中国研究》",
         text:"中国经验应当修正“宗族”“社区”等既有概念，而不是被这些概念所叙述。",
         links:[
           {to:"fei-chaxu", type:"agree", note:"与《乡土中国》的对话与检讨。"},
           {to:"fei-cultural-awareness", type:"agree", note:"共同的关切：本土经验与理论的关系。"}
         ]},
                {id:"wang-west-as-other", key:true, year:2007, branch:"theory", work:"《西方作为他者》",
         text:"他者化不是西方的专利：中国历史上有自己的“西方学”，它构成另一种理解他者的知识传统。",
         links:[{to:"asad-encounter", type:"agree", note:"补充：他者化是多样的知识实践，不限于殖民人类学。"}]}
      ]
    },
{
      id:"xiang-biao", name:"项飙", en:"Xiang Biao",
      born:1972, died:null, country:"中国 / 英国", period:"contemp",
      branches:["global", "economic"], regions:["北京（浙江村）", "印度", "澳大利亚"],
      tags:["流动", "附近", "全球劳动力"],
      summary:"流动与全球化研究的代表。他从北京“浙江村”到印度 IT 劳工，研究移民网络、全球劳动力市场与“附近”的消失。",
      statements:[
                {id:"xiang-zhejiangcun", year:2000, branch:"global", work:"《跨越边界》",
         text:"北京“浙江村”：移民网络与非正式空间如何在大城市中形成自我组织的社会。",
         links:[{to:"wolf-history", type:"agree", note:"把地方社会放进更大的流动与政治经济结构中。"}]},
                {id:"xiang-body-shopping", key:true, year:2007, branch:"economic", work:"《全球“猎身”》",
         text:"印度 IT 劳工的全球流动：中介、培训机构与签证制度构成“身体采购”的全球劳动力市场。",
         links:[
           {to:"appadurai-global", type:"agree", note:"全球化研究的劳动与身体维度。"},
           {to:"xiang-zhejiangcun", type:"agree", note:"同一关切：移民如何在制度缝隙中组织生活。"}
         ]},
                {id:"xiang-nearby", key:true, year:2017, branch:"global", work:"《附近的消失》",
         text:"“附近”的消失：生活世界被抽象系统与流动性取代，人只剩下自我与宏大世界两极。",
         links:[{to:"herzfeld-indifference", type:"agree", note:"共同关注抽象系统如何重塑日常经验。"}]},
                {id:"xiang-self-as-method", year:2020, branch:"theory", work:"《把自己作为方法》",
         text:"以个人经验为方法：在具体处境中思考理论，而不是搬运概念。",
         links:[
           {to:"xiang-nearby", type:"agree", note:"同一立场的方法论表述。"},
           {to:"fei-cultural-awareness", type:"agree", note:"与“文化自觉”一样要求从自身处境出发。"}
         ]}
      ]
    },
{
      id:"jing-jun", name:"景军", en:"Jing Jun",
      born:1957, died:null, country:"中国", period:"contemp",
      branches:["mind", "global"], regions:["甘肃", "中国"],
      tags:["记忆", "医学人类学", "消费"],
      summary:"医学与历史人类学研究者。他从甘肃孔氏家族的记忆重建到中国儿童的饮食消费，关注国家、家庭与身体的交织。",
      statements:[
                {id:"jing-temple-of-memories", key:true, year:1996, branch:"mind", work:"《神堂记忆》",
         text:"甘肃大川的孔氏家族：政治动荡之后，记忆通过重修祠堂与重写谱系被重新组织。",
         links:[
           {to:"das-critical-events", type:"agree", note:"与“关键事件”研究一样关注暴力之后的重建。"},
           {to:"wang-community-xi", type:"agree", note:"同为汉人社会的历史人类学研究。"}
         ]},
                {id:"jing-feeding-china", key:true, year:2000, branch:"mind", work:"《喂养中国小皇帝》（主编）",
         text:"独生子女政策下的儿童饮食与消费：家庭结构的变迁被写进了食物实践与身体观念。",
         links:[
           {to:"yan-private", type:"agree", note:"与私人生活变革同样关注家庭与个体的重构。"},
           {to:"jing-temple-of-memories", type:"agree", note:"同一关怀：国家政策如何进入家庭日常。"}
         ]}
      ]
    },
{
      id:"zhuang-kongshao", name:"庄孔韶", en:"Zhuang Kongshao",
      born:1946, died:null, country:"中国", period:"contemp",
      branches:["theory", "kinship"], regions:["福建"],
      tags:["回访研究", "汉人社会", "人类学中国化"],
      summary:"中国人类学的代表性学者。他以《银翅》完成对林耀华《金翼》黄村的半个世纪回访，并推动中国人类学的教学与本土化。",
      statements:[
                {id:"zhuang-silver-wings", key:true, year:2000, branch:"kinship", work:"《银翅》",
         text:"对黄村半个世纪的跟踪研究：家族与地方社会在革命、集体化与改革中既断裂又延续。",
         links:[
           {to:"lin-golden", type:"agree", note:"对同一村庄的回访与再研究，是汉人社会研究的接力。"},
           {to:"fei-peasant", type:"agree", note:"共同确立社区追踪研究的方法论价值。"}
         ]},
                {id:"zhuang-anthropology-textbook", key:true, year:2002, branch:"theory", work:"《人类学通论》（主编）",
         text:"把田野方法与理论史纳入本土教材：人类学的教学体系在中国得以系统建立。",
         links:[{to:"fei-cultural-awareness", type:"agree", note:"同样回应中国人类学的自我定位问题。"}]}
      ]
    }
  ]
};
