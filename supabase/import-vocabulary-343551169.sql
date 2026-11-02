-- Vocabulary import for 343551169@qq.com
-- Generated from 142 entries. Run in Supabase SQL Editor.
-- The app's vocabulary table has no separate phonetic column, so the
-- phonetic is prepended to the meaning, e.g. "/.../ 中文释义".
-- Existing words are updated; new words are inserted.

begin;

do $$
begin
  if not exists (
    select 1 from auth.users where lower(email) = lower('343551169@qq.com')
  ) then
    raise exception 'User 343551169@qq.com not found in auth.users';
  end if;
end $$;

with target as (
  select id as user_id
  from auth.users
  where lower(email) = lower('343551169@qq.com')
),
v(word, phonetic, meaning, example) as (
  values
    ($v$localization$v$, $v$/ˌloʊkələˈzeɪʃn/$v$, $v$本地化；本土化$v$, $v$We are working on the localization of this charging software.$v$),
    ($v$Pacific$v$, $v$/pəˈsɪfɪk/$v$, $v$太平洋的；和平的$v$, $v$The Pacific Ocean is the largest ocean on Earth.$v$),
    ($v$Asia$v$, $v$/ˈeɪʒə/$v$, $v$亚洲$v$, $v$Many new energy firms are expanding business in Asia.$v$),
    ($v$hesitant$v$, $v$/ˈhezɪtənt/$v$, $v$犹豫的，迟疑的$v$, $v$He was hesitant to sign the agreement.$v$),
    ($v$majority$v$, $v$/məˈdʒɔːrəti/$v$, $v$多数，大多数$v$, $v$The majority of users prefer this charging solution.$v$),
    ($v$anxiety$v$, $v$/æŋˈzaɪəti/$v$, $v$焦虑，不安$v$, $v$She felt anxiety about the upcoming surgery.$v$),
    ($v$toward$v$, $v$/tɔːrd/$v$, $v$向，朝；对于$v$, $v$We are moving toward a new technical standard.$v$),
    ($v$cloak$v$, $v$/kloʊk/$v$, $v$斗篷，披风；掩盖$v$, $v$He used a cloak to hide the device.$v$),
    ($v$have$v$, $v$/hæv/$v$, $v$有；拥有$v$, $v$We have a new prototype for high-power charging.$v$),
    ($v$understanding$v$, $v$/ˌʌndərˈstændɪŋ/$v$, $v$理解，谅解；共识$v$, $v$We reached an understanding on the schedule.$v$),
    ($v$perspectives$v$, $v$/pərˈspektɪvz/$v$, $v$视角，观点，看法$v$, $v$We need to consider different perspectives.$v$),
    ($v$successful$v$, $v$/səkˈsesfl/$v$, $v$成功的$v$, $v$The test was successful.$v$),
    ($v$that$v$, $v$/ðæt/$v$, $v$那个；那$v$, $v$That is the new charging station.$v$),
    ($v$supportive$v$, $v$/səˈpɔːrtɪv/$v$, $v$支持的；给予帮助的$v$, $v$My team is very supportive of this project.$v$),
    ($v$understandable$v$, $v$/ˌʌndərˈstændəbl/$v$, $v$可以理解的$v$, $v$His concern is understandable.$v$),
    ($v$you$v$, $v$/juː/$v$, $v$你；你们$v$, $v$You can check the parameter here.$v$),
    ($v$overwhelming$v$, $v$/ˌoʊvərˈwelmɪŋ/$v$, $v$压倒性的，巨大的，难以承受的$v$, $v$We got overwhelming positive feedback.$v$),
    ($v$stressful$v$, $v$/ˈstresfl/$v$, $v$充满压力的，紧张的$v$, $v$The pre-release week is really stressful.$v$),
    ($v$ignorant$v$, $v$/ˈɪɡnərənt/$v$, $v$无知的，缺乏了解的$v$, $v$Don’t be ignorant of safety rules.$v$),
    ($v$fiction$v$, $v$/ˈfɪkʃn/$v$, $v$小说；虚构的事$v$, $v$This story is pure fiction.$v$),
    ($v$equation$v$, $v$/ɪˈkweɪʒn/$v$, $v$方程，等式；平衡$v$, $v$This equation describes the thermal behavior.$v$),
    ($v$island$v$, $v$/ˈaɪlənd/$v$, $v$岛屿$v$, $v$There is a small island near the coast.$v$),
    ($v$survive$v$, $v$/sərˈvaɪv/$v$, $v$幸存，存活；挺过$v$, $v$The system can survive extreme temperature.$v$),
    ($v$feisty$v$, $v$/ˈfaɪsti/$v$, $v$好强的；活泼果敢的$v$, $v$She is a feisty engineer with great ideas.$v$),
    ($v$spoiled$v$, $v$/spɔɪld/$v$, $v$被宠坏的；变质的$v$, $v$The milk got spoiled in the heat.$v$),
    ($v$curiosity$v$, $v$/ˌkjʊriˈɑːsəti/$v$, $v$好奇，好奇心$v$, $v$Curiosity drives technical innovation.$v$),
    ($v$adversity$v$, $v$/ədˈvɜːrsəti/$v$, $v$逆境，困境，磨难$v$, $v$We grow stronger through adversity.$v$),
    ($v$passionate$v$, $v$/ˈpæʃənət/$v$, $v$热情的，充满激情的$v$, $v$He is passionate about charging technology.$v$),
    ($v$unfairness$v$, $v$/ʌnˈfernəs/$v$, $v$不公平，不公正$v$, $v$We will not accept this unfairness.$v$),
    ($v$vanity$v$, $v$/ˈvænəti/$v$, $v$虚荣，自负$v$, $v$Vanity will blind your judgment.$v$),
    ($v$abandon$v$, $v$/əˈbændən/$v$, $v$放弃，抛弃$v$, $v$We won’t abandon this development path.$v$),
    ($v$if$v$, $v$/ɪf/$v$, $v$如果；假如$v$, $v$If the current rises, the protection triggers.$v$),
    ($v$audience$v$, $v$/ˈɔːdiəns/$v$, $v$观众；听众；受众$v$, $v$The audience asked many technical questions.$v$),
    ($v$mystery$v$, $v$/ˈmɪstəri/$v$, $v$神秘，谜$v$, $v$The root cause was a mystery at first.$v$),
    ($v$perspective$v$, $v$/pərˈspektɪv/$v$, $v$视角，观点；远景$v$, $v$Let’s look at it from a system perspective.$v$),
    ($v$shelf$v$, $v$/ʃelf/$v$, $v$架子，搁板$v$, $v$Put the test report on the shelf.$v$),
    ($v$announce$v$, $v$/əˈnaʊns/$v$, $v$宣布，通告$v$, $v$We will announce the new standard next month.$v$),
    ($v$sightseeing$v$, $v$/ˈsaɪtsiːɪŋ/$v$, $v$观光，游览$v$, $v$We went sightseeing after the meeting.$v$),
    ($v$embarrassing$v$, $v$/ɪmˈbærəsɪŋ/$v$, $v$令人尴尬的，难堪的$v$, $v$It was an embarrassing mistake.$v$),
    ($v$mastery$v$, $v$/ˈmæstəri/$v$, $v$精通，掌握；掌控$v$, $v$Mastery of this protocol takes time.$v$),
    ($v$discipline$v$, $v$/ˈdɪsəplɪn/$v$, $v$纪律；学科；自律$v$, $v$Self-discipline is important for R&D work.$v$),
    ($v$obvious$v$, $v$/ˈɑːbviəs/$v$, $v$明显的，显而易见的$v$, $v$The defect is obvious on the diagram.$v$),
    ($v$superior$v$, $v$/suːˈpɪriər/$v$, $v$优越的；上级；更好的$v$, $v$This design has superior efficiency.$v$),
    ($v$teenagers$v$, $v$/ˈtiːneɪdʒərz/$v$, $v$青少年$v$, $v$The safety video is made for teenagers.$v$),
    ($v$ambitious$v$, $v$/æmˈbɪʃəs/$v$, $v$有抱负的；宏大的$v$, $v$This is an ambitious development plan.$v$),
    ($v$controversial$v$, $v$/ˌkɑːntrəˈvɜːrʃl/$v$, $v$有争议的$v$, $v$This solution is still controversial.$v$),
    ($v$shifted$v$, $v$/ˈʃɪftɪd/$v$, $v$转移，改变，切换$v$, $v$Our focus shifted to high-power charging.$v$),
    ($v$equivalent$v$, $v$/ɪˈkwɪvələnt/$v$, $v$等价的；等效物$v$, $v$This voltage is equivalent to 800V platform.$v$),
    ($v$career$v$, $v$/kəˈrɪr/$v$, $v$职业，职业生涯$v$, $v$He built his career in new energy.$v$),
    ($v$evolving$v$, $v$/ɪˈvɑːlvɪŋ/$v$, $v$不断演变的，进化的$v$, $v$The charging standard is still evolving.$v$),
    ($v$hawk$v$, $v$/hɔːk/$v$, $v$鹰；兜售，叫卖$v$, $v$The hawk soared above the hills.$v$),
    ($v$you're$v$, $v$/jʊr/$v$, $v$你是$v$, $v$You're responsible for this module.$v$),
    ($v$rational$v$, $v$/ˈræʃnəl/$v$, $v$理性的，合理的$v$, $v$We need a rational analysis.$v$),
    ($v$cheat$v$, $v$/tʃiːt/$v$, $v$欺骗；作弊$v$, $v$Do not cheat in the test.$v$),
    ($v$sensitive$v$, $v$/ˈsensətɪv/$v$, $v$敏感的；灵敏的$v$, $v$This sensor is sensitive to temperature.$v$),
    ($v$divorce$v$, $v$/dɪˈvɔːrs/$v$, $v$离婚$v$, $v$They decided to get a divorce.$v$),
    ($v$partnerships$v$, $v$/ˈpɑːrtnərʃɪps/$v$, $v$伙伴关系，合作关系$v$, $v$We built partnerships with many suppliers.$v$),
    ($v$gonna$v$, $v$/ˈɡɔːnə/$v$, $v$将要$v$, $v$I’m gonna finish the drawing tonight.$v$),
    ($v$cheerful$v$, $v$/ˈtʃɪrfl/$v$, $v$愉快的，乐观的$v$, $v$She is always cheerful in the lab.$v$),
    ($v$antique$v$, $v$/ænˈtiːk/$v$, $v$古董，古玩；古老的$v$, $v$This table is an antique.$v$),
    ($v$screenshot$v$, $v$/ˈskriːnʃɑːt/$v$, $v$截图$v$, $v$Send me a screenshot of the error log.$v$),
    ($v$noodles$v$, $v$/ˈnuːdlz/$v$, $v$面条$v$, $v$I had beef noodles for lunch.$v$),
    ($v$vinegar$v$, $v$/ˈvɪnɪɡər/$v$, $v$醋$v$, $v$Add a little vinegar to the sauce.$v$),
    ($v$treasure$v$, $v$/ˈtreʒər/$v$, $v$珍宝，宝藏；珍视$v$, $v$Time is our greatest treasure.$v$),
    ($v$amateur$v$, $v$/ˈæmətʃʊr/$v$, $v$业余爱好者，外行$v$, $v$He is an amateur photographer.$v$),
    ($v$surgeries$v$, $v$/ˈsɜːrdʒəriz/$v$, $v$外科手术$v$, $v$She has had two surgeries this year.$v$),
    ($v$horrible$v$, $v$/ˈhɔːrəbl/$v$, $v$可怕的，糟糕的$v$, $v$The test result was horrible.$v$),
    ($v$trustable$v$, $v$/ˈtrʌstəbl/$v$, $v$可靠的，可信赖的$v$, $v$This chip is trustable for vehicle use.$v$),
    ($v$raise$v$, $v$/reɪz/$v$, $v$提高；筹集；抚养；引起$v$, $v$We need to raise the output power.$v$),
    ($v$guilty$v$, $v$/ˈɡɪlti/$v$, $v$内疚的；有罪的$v$, $v$He felt guilty for the delay.$v$),
    ($v$sponsor$v$, $v$/ˈspɑːnsər/$v$, $v$赞助商；资助；发起$v$, $v$This firm is the main sponsor.$v$),
    ($v$approachable$v$, $v$/əˈproʊtʃəbl/$v$, $v$平易近人的；可接近的$v$, $v$The chief engineer is very approachable.$v$),
    ($v$irrational$v$, $v$/ɪˈræʃənl/$v$, $v$非理性的，不合理的$v$, $v$That assumption is irrational.$v$),
    ($v$envelope$v$, $v$/ˈenvəloʊp/$v$, $v$信封；包络；外壳$v$, $v$Check the voltage envelope of the circuit.$v$),
    ($v$influence$v$, $v$/ˈɪnfluəns/$v$, $v$影响，作用$v$, $v$Temperature influences charging efficiency.$v$),
    ($v$recruit$v$, $v$/rɪˈkruːt/$v$, $v$招募，招聘；新兵$v$, $v$We recruit power electronics engineers.$v$),
    ($v$compliance$v$, $v$/kəmˈplaɪəns/$v$, $v$合规，服从$v$, $v$All designs must meet compliance rules.$v$),
    ($v$watershed$v$, $v$/ˈwɔːtərʃed/$v$, $v$分水岭；转折点$v$, $v$This test is a watershed for the project.$v$),
    ($v$pursuits$v$, $v$/pərˈsuːts/$v$, $v$追求；爱好；事业$v$, $v$Scientific pursuits require patience.$v$),
    ($v$materialism$v$, $v$/məˈtɪriəlɪzəm/$v$, $v$唯物主义；物质主义$v$, $v$He does not agree with materialism.$v$),
    ($v$allure$v$, $v$/əˈlʊr/$v$, $v$吸引力，诱惑力$v$, $v$The allure of fast charging is obvious.$v$),
    ($v$imagination$v$, $v$/ɪˌmædʒɪˈneɪʃn/$v$, $v$想象力，想象$v$, $v$Engineering needs imagination.$v$),
    ($v$stability$v$, $v$/stəˈbɪləti/$v$, $v$稳定性，稳固性$v$, $v$We focus on system stability.$v$),
    ($v$allergic$v$, $v$/əˈlɜːrdʒɪk/$v$, $v$过敏的$v$, $v$She is allergic to dust.$v$),
    ($v$sneezing$v$, $v$/ˈsniːzɪŋ/$v$, $v$打喷嚏$v$, $v$He kept sneezing this morning.$v$),
    ($v$transcend$v$, $v$/trænˈsend/$v$, $v$超越，超出$v$, $v$This design transcends old limits.$v$),
    ($v$dynasty$v$, $v$/ˈdaɪnəsti/$v$, $v$王朝，朝代$v$, $v$The Ming Dynasty lasted hundreds of years.$v$),
    ($v$welfare$v$, $v$/ˈwelfer/$v$, $v$福利，福祉；安康$v$, $v$The company cares about staff welfare.$v$),
    ($v$competition$v$, $v$/ˌkɑːmpəˈtɪʃn/$v$, $v$竞争，比赛$v$, $v$The competition in charging is fierce.$v$),
    ($v$pumping$v$, $v$/ˈpʌmpɪŋ/$v$, $v$泵送；抽运$v$, $v$The pumping circuit controls current.$v$),
    ($v$skateboard$v$, $v$/ˈskeɪtbɔːrd/$v$, $v$滑板$v$, $v$He rides a skateboard to the park.$v$),
    ($v$legend$v$, $v$/ˈledʒənd/$v$, $v$传说；图例$v$, $v$Check the legend on the schematic.$v$),
    ($v$evolve$v$, $v$/ɪˈvɑːlv/$v$, $v$进化，演变，发展$v$, $v$Battery technology will keep evolving.$v$),
    ($v$streaming$v$, $v$/ˈstriːmɪŋ/$v$, $v$流媒体；流式传输$v$, $v$Streaming data comes in real time.$v$),
    ($v$conscience$v$, $v$/ˈkɑːnʃəns/$v$, $v$良心，道德心$v$, $v$He followed his conscience.$v$),
    ($v$shuffling$v$, $v$/ˈʃʌflɪŋ/$v$, $v$拖着脚走；打乱，翻找$v$, $v$He was shuffling through the documents.$v$),
    ($v$funeral$v$, $v$/ˈfjuːnərəl/$v$, $v$葬礼$v$, $v$Many friends came to the funeral.$v$),
    ($v$toughest$v$, $v$/ˈtʌfɪst/$v$, $v$最艰难的；最强硬的；最难对付的$v$, $v$This is the toughest test case.$v$),
    ($v$destination$v$, $v$/ˌdestɪˈneɪʃn/$v$, $v$目的地；终点$v$, $v$The charging station is our next destination.$v$),
    ($v$architecture$v$, $v$/ˈɑːrkɪtektʃər/$v$, $v$建筑学；架构$v$, $v$This is a new power architecture.$v$),
    ($v$fantastic$v$, $v$/fænˈtæstɪk/$v$, $v$极好的，奇妙的$v$, $v$The test result is fantastic.$v$),
    ($v$ancient$v$, $v$/ˈeɪnʃənt/$v$, $v$古老的，古代的$v$, $v$This is an ancient building.$v$),
    ($v$transportation$v$, $v$/ˌtrænspərˈteɪʃn/$v$, $v$交通，运输$v$, $v$Electric transportation is growing fast.$v$),
    ($v$convenient$v$, $v$/kənˈviːniənt/$v$, $v$方便的，便利的$v$, $v$Fast charging is very convenient.$v$),
    ($v$countryside$v$, $v$/ˈkʌntrisaɪd/$v$, $v$乡村，农村$v$, $v$We live near the countryside.$v$),
    ($v$situation$v$, $v$/ˌsɪtʃuˈeɪʃn/$v$, $v$情况，处境，形势$v$, $v$Please update me on the situation.$v$),
    ($v$debate$v$, $v$/dɪˈbeɪt/$v$, $v$争论，辩论$v$, $v$We had a debate on topology selection.$v$),
    ($v$elegant$v$, $v$/ˈelɪɡənt/$v$, $v$优雅的；简洁精妙的$v$, $v$This circuit has an elegant design.$v$),
    ($v$civilization$v$, $v$/ˌsɪvələˈzeɪʃn/$v$, $v$文明$v$, $v$Electric vehicles push civilization forward.$v$),
    ($v$prioritize$v$, $v$/praɪˈɔːrətaɪz/$v$, $v$优先处理；优先考虑$v$, $v$We prioritize safety first.$v$),
    ($v$attack$v$, $v$/əˈtæk/$v$, $v$攻击，抨击；侵袭$v$, $v$Prevent overvoltage attack on the board.$v$),
    ($v$anxious$v$, $v$/ˈæŋkʃəs/$v$, $v$焦虑的，担忧的$v$, $v$He felt anxious about the review.$v$),
    ($v$Mandarin$v$, $v$/ˈmændərɪn/$v$, $v$普通话；官话$v$, $v$We communicate in Mandarin.$v$),
    ($v$obsessed$v$, $v$/əbˈsest/$v$, $v$着迷的，痴迷的$v$, $v$He is obsessed with charger optimization.$v$),
    ($v$confident$v$, $v$/ˈkɑːnfɪdənt/$v$, $v$自信的，有把握的$v$, $v$I am confident about this design.$v$),
    ($v$strengthen$v$, $v$/ˈstreŋθn/$v$, $v$加强，增强$v$, $v$We need to strengthen thermal design.$v$),
    ($v$cursing$v$, $v$/ˈkɜːrsɪŋ/$v$, $v$诅咒；咒骂$v$, $v$Cursing is not allowed in the meeting.$v$),
    ($v$precisely$v$, $v$/prɪˈsaɪsli/$v$, $v$精确地；恰恰，正是$v$, $v$That is precisely what we need.$v$),
    ($v$panelists$v$, $v$/ˈpænəlɪsts/$v$, $v$专家组成员，评委$v$, $v$The panelists asked sharp questions.$v$),
    ($v$interviewer$v$, $v$/ˈɪntərvjuːər/$v$, $v$面试官；采访者$v$, $v$The interviewer asked about topology.$v$),
    ($v$opposite$v$, $v$/ˈɑːpəzɪt/$v$, $v$相反的；对面的$v$, $v$The result was the opposite of expectation.$v$),
    ($v$dreaming$v$, $v$/ˈdriːmɪŋ/$v$, $v$做梦；梦想$v$, $v$He is dreaming of a zero-carbon system.$v$),
    ($v$emphasize$v$, $v$/ˈemfəsaɪz/$v$, $v$强调，着重$v$, $v$I want to emphasize safety limits.$v$),
    ($v$represent$v$, $v$/ˌreprɪˈzent/$v$, $v$代表；象征；表示$v$, $v$This curve represents efficiency.$v$),
    ($v$exchange$v$, $v$/ɪksˈtʃeɪndʒ/$v$, $v$交换；交流；兑换$v$, $v$We exchange technical data regularly.$v$),
    ($v$adult$v$, $v$/əˈdʌlt/$v$, $v$成人，成年人$v$, $v$This operation must be done by an adult.$v$),
    ($v$satisfy$v$, $v$/ˈsætɪsfaɪ/$v$, $v$满足，使满意$v$, $v$The design must satisfy GB standards.$v$),
    ($v$apologize$v$, $v$/əˈpɑːlədʒaɪz/$v$, $v$道歉$v$, $v$I apologize for the delay.$v$),
    ($v$extremely$v$, $v$/ɪkˈstriːmli/$v$, $v$极其，非常$v$, $v$This part is extremely important.$v$),
    ($v$conclusion$v$, $v$/kənˈkluːʒn/$v$, $v$结论，推论$v$, $v$We reached a conclusion today.$v$),
    ($v$appreciate$v$, $v$/əˈpriːʃieɪt/$v$, $v$感激；欣赏；重视$v$, $v$I appreciate your technical support.$v$),
    ($v$percentage$v$, $v$/pərˈsentɪdʒ/$v$, $v$百分比，百分率$v$, $v$What percentage of loss is acceptable?$v$),
    ($v$couples$v$, $v$/ˈkʌplz/$v$, $v$夫妇，情侣；一对$v$, $v$Many couples came to the exhibition.$v$),
    ($v$decreasing$v$, $v$/dɪˈkriːsɪŋ/$v$, $v$减少，下降$v$, $v$Loss is decreasing at lower current.$v$),
    ($v$livestream$v$, $v$/ˈlaɪvstriːm/$v$, $v$直播$v$, $v$We will livestream the test demo.$v$),
    ($v$admire$v$, $v$/ədˈmaɪər/$v$, $v$钦佩，赞赏$v$, $v$I admire his deep knowledge of power electronics.$v$),
    ($v$potential$v$, $v$/pəˈtenʃl/$v$, $v$潜在的；潜力；电势$v$, $v$This topology has great potential.$v$),
    ($v$definitely$v$, $v$/ˈdefɪnətli/$v$, $v$肯定地，毫无疑问地$v$, $v$This will definitely improve performance.$v$),
    ($v$proud$v$, $v$/praʊd/$v$, $v$骄傲的，自豪的$v$, $v$We are proud of this domestic design.$v$),
    ($v$mentality$v$, $v$/menˈtæləti/$v$, $v$心态，思维方式$v$, $v$We need a problem-solving mentality.$v$),
    ($v$frustrated$v$, $v$/ˈfrʌstreɪtɪd/$v$, $v$沮丧的，受挫的$v$, $v$He felt frustrated after the failure.$v$),
    ($v$insecure$v$, $v$/ˌɪnsɪˈkjʊr/$v$, $v$缺乏安全感的；不安全的；不稳定的$v$, $v$The connection is insecure under vibration.$v$)
)
insert into public.vocabulary (user_id, word, meaning, example)
select
  t.user_id,
  v.word,
  case when v.phonetic <> '' then v.phonetic || ' ' else '' end || v.meaning,
  v.example
from target t
cross join v
on conflict (user_id, word) do update
set meaning = excluded.meaning,
    example = excluded.example;

select count(*) as vocabulary_count
from public.vocabulary v
join auth.users u on u.id = v.user_id
where lower(u.email) = lower('343551169@qq.com');

commit;
