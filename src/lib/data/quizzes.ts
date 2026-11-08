import { QUIZ_EXTRA_PACKS, QUIZ_EXTRA_QUESTIONS } from "./quizzes-extra.ts";

export interface QuizQuestion {
  id: string;
  quizId: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  source?: string;
}

export interface QuizPack {
  id: string;
  category: string;
  title: string;
  desc: string;
  level: "سهل" | "متوسط" | "صعب";
  source: string;
}

export const QUIZ_CATEGORIES = [
  { id: "tajweed", name: "التجويد", desc: "مخارج، أحكام النون، المدود، والقلقلة", level: "متوسط" },
  { id: "seerah", name: "السيرة النبوية", desc: "مراحل حياة النبي ﷺ وأحداث بارزة", level: "سهل" },
  { id: "adhkar", name: "الأذكار والأدعية", desc: "أذكار الصباح والمساء والصلاة", level: "سهل" },
  { id: "quran", name: "علوم القرآن", desc: "السور، الأحكام، ومعاني أساسية", level: "متوسط" },
  { id: "fiqh", name: "الفقه", desc: "طهارة، صلاة، صيام، وزكاة مبسّطة", level: "متوسط" },
  { id: "hadith", name: "الحديث الشريف", desc: "أحاديث مشهورة ومصدرها", level: "متوسط" },
  { id: "aqidah", name: "العقيدة", desc: "أركان الإيمان والتوحيد بأسلوب ميسّر", level: "متوسط" },
] as const;

/** عدة اختبارات مستقلة داخل كل قسم */
const BASE_PACKS: QuizPack[] = [
  // تجويد
  { id: "tajweed-basics", category: "tajweed", title: "أساسيات التجويد", desc: "التعريف، اللحن، والاستعاذة والبسملة", level: "سهل", source: "التجويد الميسر" },
  { id: "tajweed-noon", category: "tajweed", title: "أحكام النون والميم", desc: "إظهار، إدغام، إقلاب، إخفاء", level: "متوسط", source: "تحفة الأطفال" },
  { id: "tajweed-madd", category: "tajweed", title: "المدود والقلقلة", desc: "المد الطبيعي والمتصل واللازم والقلقلة", level: "متوسط", source: "ابن الجزري / نهاية القول المفيد" },
  { id: "tajweed-advanced", category: "tajweed", title: "الوقف والابتداء", desc: "علامات المصحف وهمزة الوصل", level: "صعب", source: "نهاية القول المفيد" },
  // سيرة
  { id: "seerah-makkah", category: "seerah", title: "العهد المكي", desc: "من المولد إلى الهجرة", level: "سهل", source: "الرحيق المختوم / ابن هشام" },
  { id: "seerah-madinah", category: "seerah", title: "العهد المدني", desc: "من الهجرة إلى الوفاة", level: "متوسط", source: "الرحيق المختوم / ابن هشام" },
  { id: "seerah-battles", category: "seerah", title: "الغزوات الكبرى", desc: "بدر، أحد، الخندق، فتح مكة", level: "متوسط", source: "الرحيق المختوم" },
  // أذكار
  { id: "adhkar-day", category: "adhkar", title: "أذكار اليوم والليلة", desc: "الصباح والمساء والنوم", level: "سهل", source: "حصن المسلم" },
  { id: "adhkar-prayer", category: "adhkar", title: "أذكار الصلاة", desc: "قبل الصلاة وبعدها", level: "سهل", source: "حصن المسلم / الأذكار للنووي" },
  // قرآن
  { id: "quran-basics", category: "quran", title: "مقدمات علوم القرآن", desc: "عدد السور والمكي والمدني", level: "سهل", source: "مباحث في علوم القرآن" },
  { id: "quran-ahkam", category: "quran", title: "أحكام وآداب التلاوة", desc: "الاستعاذة والبسملة وآداب الحملة", level: "متوسط", source: "التبيان / التجويد الميسر" },
  // فقه
  { id: "fiqh-taharah", category: "fiqh", title: "الطهارة", desc: "وضوء، غسل، تيمم", level: "سهل", source: "الفقه الميسر" },
  { id: "fiqh-salah", category: "fiqh", title: "الصلاة", desc: "أركان وواجبات وشروط", level: "متوسط", source: "الفقه الميسر / عمدة الأحكام" },
  { id: "fiqh-siyam", category: "fiqh", title: "الصيام والزكاة", desc: "مفطرات وزكاة الفطر", level: "متوسط", source: "الفقه الميسر" },
  // حديث
  { id: "hadith-nawawi", category: "hadith", title: "من الأربعين النووية", desc: "أحاديث جامعة في الإسلام", level: "سهل", source: "الأربعون النووية" },
  { id: "hadith-riyad", category: "hadith", title: "من رياض الصالحين", desc: "أخلاق ومعاملات", level: "متوسط", source: "رياض الصالحين" },
  // عقيدة
  { id: "aqidah-iman", category: "aqidah", title: "أركان الإيمان", desc: "الإيمان بالله وملائكته وكتبه", level: "سهل", source: "الأصول الثلاثة / حديث جبريل" },
  { id: "aqidah-tawhid", category: "aqidah", title: "التوحيد وأنواعه", desc: "ربوبية، ألوهية، أسماء وصفات", level: "متوسط", source: "كتاب التوحيد / الأصول الثلاثة" },
];

const BASE_QUESTIONS: QuizQuestion[] = [
  // ===== tajweed-basics =====
  { id: "tb1", quizId: "tajweed-basics", category: "tajweed", question: "التجويد اصطلاحاً هو:", options: ["سرعة القراءة فقط", "إعطاء كل حرف حقه ومستحقه", "حفظ القرآن فقط", "ترجمة المعاني"], correctIndex: 1, explanation: "إخراج كل حرف من مخرجه مع صفاته.", source: "التجويد الميسر" },
  { id: "tb2", quizId: "tajweed-basics", category: "tajweed", question: "اللحن الجلي هو:", options: ["خطأ لا يغيّر المعنى", "خطأ يغيّر المعنى أو الإعراب", "نوع من المد", "وقف مستحب"], correctIndex: 1, explanation: "خطأ ظاهر يغيّر المعنى أو بنية الكلمة.", source: "نهاية القول المفيد" },
  { id: "tb3", quizId: "tajweed-basics", category: "tajweed", question: "يُستحب قبل التلاوة:", options: ["السكوت فقط", "الاستعاذة", "التهليل فقط", "لا شيء"], correctIndex: 1, explanation: "الاستعاذة عند قراءة القرآن.", source: "النحل 98 / التجويد الميسر" },
  { id: "tb4", quizId: "tajweed-basics", category: "tajweed", question: "مراتب القراءة تشمل:", options: ["التحقيق والتدوير والحدر", "السرعة فقط", "الهمس فقط", "الوقف فقط"], correctIndex: 0, explanation: "ثلاث مراتب معروفة.", source: "التجويد المصور" },
  { id: "tb5", quizId: "tajweed-basics", category: "tajweed", question: "عدد مخارج الحروف عند الجمهور تقريباً:", options: ["3", "5 رئيسية تتفرع", "20 دون تفصيل", "لا يوجد مخرج"], correctIndex: 1, explanation: "الجوف والحلق واللسان والشفتان والخيشوم.", source: "ابن الجزري" },
  { id: "tb6", quizId: "tajweed-basics", category: "tajweed", question: "حروف الاستعلاء:", options: ["قطب جد", "خص ضغط قظ", "فر من لب", "ينمو"], correctIndex: 1, explanation: "تُفخَّم.", source: "ابن الجزري" },
  { id: "tb7", quizId: "tajweed-basics", category: "tajweed", question: "حروف الهمس مجموعة في:", options: ["قطب جد", "فحثه شخص سكت", "ينمو", "خص ضغط قظ"], correctIndex: 1, explanation: "فحثه شخص سكت.", source: "ابن الجزري" },
  { id: "tb8", quizId: "tajweed-basics", category: "tajweed", question: "الغنة مخرجها:", options: ["الشفتان فقط", "الخيشوم", "أقصى الحلق", "الجوف"], correctIndex: 1, explanation: "الخيشوم.", source: "التجويد الميسر" },

  // ===== tajweed-noon =====
  { id: "tn1", quizId: "tajweed-noon", category: "tajweed", question: "حكم النون الساكنة قبل حروف الحلق:", options: ["إدغام", "إظهار حلقي", "إقلاب", "إخفاء"], correctIndex: 1, explanation: "إظهار حلقي.", source: "تحفة الأطفال" },
  { id: "tn2", quizId: "tajweed-noon", category: "tajweed", question: "حروف الإدغام بغنة مجموعة في:", options: ["يرملون", "ينمو", "قطب جد", "فحثه"], correctIndex: 1, explanation: "ينمو.", source: "تحفة الأطفال" },
  { id: "tn3", quizId: "tajweed-noon", category: "tajweed", question: "الإقلاب يكون عند حرف:", options: ["الميم", "الباء", "الواو", "الراء"], correctIndex: 1, explanation: "عند الباء مع غنة.", source: "تحفة الأطفال" },
  { id: "tn4", quizId: "tajweed-noon", category: "tajweed", question: "الإخفاء الحقيقي يكون:", options: ["عند كل الحروف", "عند باقي الحروف بعد استثناء الإظهار والإدغام والإقلاب", "عند الحلق فقط", "لا يوجد"], correctIndex: 1, explanation: "مع غنة.", source: "تحفة الأطفال" },
  { id: "tn5", quizId: "tajweed-noon", category: "tajweed", question: "الميم الساكنة قبل الباء:", options: ["إظهار شفوي", "إخفاء شفوي", "إقلاب", "مد لازم"], correctIndex: 1, explanation: "إخفاء شفوي بغنة.", source: "تحفة الأطفال" },
  { id: "tn6", quizId: "tajweed-noon", category: "tajweed", question: "ميم ساكنة بعدها ميم:", options: ["إظهار", "إدغام مثلين صغير بغنة", "إقلاب", "قلقلة"], correctIndex: 1, explanation: "إدغام مع غنة.", source: "التجويد الميسر" },
  { id: "tn7", quizId: "tajweed-noon", category: "tajweed", question: "أكمل مراتب الغنة:", options: ["في الإظهار", "في النون والميم المشددتين", "في القلقلة", "في المد الطبيعي"], correctIndex: 1, explanation: "أكمل الغنن في المشدد.", source: "التجويد المصور" },
  { id: "tn8", quizId: "tajweed-noon", category: "tajweed", question: "لام «ال» الشمسية:", options: ["تظهر", "تُدغم فيما بعدها", "تقلب واواً", "تمد 6 حركات"], correctIndex: 1, explanation: "تُدغم.", source: "تحفة الأطفال" },

  // ===== tajweed-madd =====
  { id: "tm1", quizId: "tajweed-madd", category: "tajweed", question: "مقدار المد الطبيعي:", options: ["حركة", "حركتان", "أربع", "ست"], correctIndex: 1, explanation: "حركتان.", source: "التجويد الميسر" },
  { id: "tm2", quizId: "tajweed-madd", category: "tajweed", question: "المد المتصل حكمه:", options: ["جائز", "واجب", "ممنوع", "مكروه"], correctIndex: 1, explanation: "واجب عند الجمهور بمقدار 4–5.", source: "نهاية القول المفيد" },
  { id: "tm3", quizId: "tajweed-madd", category: "tajweed", question: "المد اللازم يُمد:", options: ["حركتين", "أربعاً", "ست حركات", "لا يمد"], correctIndex: 2, explanation: "لزوماً ست حركات.", source: "نهاية القول المفيد" },
  { id: "tm4", quizId: "tajweed-madd", category: "tajweed", question: "حروف القلقلة:", options: ["ينمو", "قطب جد", "خص ضغط قظ", "فحثه شخص سكت"], correctIndex: 1, explanation: "قطب جد.", source: "ابن الجزري" },
  { id: "tm5", quizId: "tajweed-madd", category: "tajweed", question: "القلقلة تكون أوضح:", options: ["في الوصل فقط", "عند سكون الحرف وخصوصاً في الوقف", "في المتحرك فقط", "لا تسمع"], correctIndex: 1, explanation: "أظهر في الوقف.", source: "التجويد الميسر" },
  { id: "tm6", quizId: "tajweed-madd", category: "tajweed", question: "المد المنفصل:", options: ["واجب بلا خلاف", "جائز يُمد حركتين إلى أربع أو خمس بحسب الرواية", "ممنوع", "ست فقط"], correctIndex: 1, explanation: "جائز.", source: "نهاية القول المفيد" },
  { id: "tm7", quizId: "tajweed-madd", category: "tajweed", question: "حروف المد:", options: ["ا و ي الساكنات بعد مجانس", "ب ت ث", "قطب جد", "ينمو"], correctIndex: 0, explanation: "الألف والواو والياء المدّيتان.", source: "التجويد الميسر" },
  { id: "tm8", quizId: "tajweed-madd", category: "tajweed", question: "العارض للسكون:", options: ["لا يمد", "يجوز مده حركتين أو أربعاً أو ستاً مع توحيد الوجه", "واجب ست فقط", "مد متصل"], correctIndex: 1, explanation: "أوجه معروفة.", source: "نهاية القول المفيد" },

  // ===== tajweed-advanced =====
  { id: "ta1", quizId: "tajweed-advanced", category: "tajweed", question: "علامة «مـ» في المصحف:", options: ["وقف جائز", "وقف لازم", "لا تقف", "سكت"], correctIndex: 1, explanation: "وقف لازم.", source: "علامات المصحف" },
  { id: "ta2", quizId: "tajweed-advanced", category: "tajweed", question: "همزة الوصل:", options: ["تثبت وصلاً وابتداءً", "تثبت ابتداءً وتسقط وصلاً", "تسقط دائماً", "لا في القرآن"], correctIndex: 1, explanation: "تُنطق ابتداءً.", source: "التجويد الميسر" },
  { id: "ta3", quizId: "tajweed-advanced", category: "tajweed", question: "الوقف القبيح هو:", options: ["الوقف التام", "ما يفسد المعنى أو يوهم خلاف المراد", "وقف آخر السورة", "السكت"], correctIndex: 1, explanation: "يُتجنّب.", source: "نهاية القول المفيد" },
  { id: "ta4", quizId: "tajweed-advanced", category: "tajweed", question: "السكت في رواية حفص:", options: ["لا يوجد", "مواضع معدودة معروفة", "في كل آية", "بدل الوقف"], correctIndex: 1, explanation: "مثل عوجاً، مرقدنا…", source: "التجويد الميسر" },
  { id: "ta5", quizId: "tajweed-advanced", category: "tajweed", question: "الإظهار المطلق يقع:", options: ["في كل إدغام", "في كلمات مخصوصة مثل الدنيا وبنيان", "عند الباء فقط", "لا يوجد"], correctIndex: 1, explanation: "استثناء من الإدغام.", source: "تحفة الأطفال" },
  { id: "ta6", quizId: "tajweed-advanced", category: "tajweed", question: "الروم والإشمام متعلقان بـ:", options: ["الابتداء فقط", "الوقف على المتحرك", "المد اللازم فقط", "الهمس"], correctIndex: 1, explanation: "كيفيات وقف.", source: "نهاية القول المفيد" },

  // ===== seerah-makkah =====
  { id: "sm1", quizId: "seerah-makkah", category: "seerah", question: "وُلد النبي ﷺ في:", options: ["المدينة", "مكة", "الطائف", "بدر"], correctIndex: 1, explanation: "مكة عام الفيل.", source: "الرحيق المختوم" },
  { id: "sm2", quizId: "seerah-makkah", category: "seerah", question: "أول ما نزل من القرآن:", options: ["سورة الناس", "اقرأ باسم ربك", "الفاتحة كاملة أول مرة", "سورة النصر"], correctIndex: 1, explanation: "صدر سورة العلق.", source: "صحيح البخاري" },
  { id: "sm3", quizId: "seerah-makkah", category: "seerah", question: "من أول من آمن من الرجال:", options: ["عمر أولاً بإجماع", "أبو بكر الصديق", "أبو جهل", "أمية"], correctIndex: 1, explanation: "أبو بكر من السابقين.", source: "ابن هشام" },
  { id: "sm4", quizId: "seerah-makkah", category: "seerah", question: "الهجرة إلى الحبشة كانت بسبب:", options: ["التجارة فقط", "الفرار من الأذى وحفظ الدين", "القتال", "طلب الملك"], correctIndex: 1, explanation: "طلب الأمن على الدين.", source: "ابن هشام" },
  { id: "sm5", quizId: "seerah-makkah", category: "seerah", question: "عام الحزن فيه:", options: ["فتح مكة", "وفاة خديجة وأبي طالب", "غزوة بدر", "حجة الوداع"], correctIndex: 1, explanation: "سمي عام الحزن.", source: "الرحيق المختوم" },
  { id: "sm6", quizId: "seerah-makkah", category: "seerah", question: "الإسراء كان من:", options: ["المدينة إلى تبوك", "المسجد الحرام إلى المسجد الأقصى", "بدر إلى أحد", "الطائف إلى مكة"], correctIndex: 1, explanation: "كما في سورة الإسراء.", source: "صحيح البخاري" },
  { id: "sm7", quizId: "seerah-makkah", category: "seerah", question: "بيعة العقبة كانت مع:", options: ["قريش", "الأنصار من الأوس والخزرج", "فارس", "الروم"], correctIndex: 1, explanation: "مهّدت للهجرة.", source: "ابن هشام" },
  { id: "sm8", quizId: "seerah-makkah", category: "seerah", question: "صاحب النبي ﷺ في الهجرة:", options: ["علي فقط في الغار", "أبو بكر الصديق", "عمر في الغار", "عثمان في الغار"], correctIndex: 1, explanation: "أبو بكر في الغار.", source: "التوبة / البخاري" },

  // ===== seerah-madinah =====
  { id: "sd1", quizId: "seerah-madinah", category: "seerah", question: "أول عمل بارز بعد الهجرة:", options: ["هدم الكعبة", "بناء المسجد المؤاخاة", "غزو الروم فوراً", "إلغاء الصلاة"], correctIndex: 1, explanation: "المسجد والمؤاخاة.", source: "الرحيق المختوم" },
  { id: "sd2", quizId: "seerah-madinah", category: "seerah", question: "تحويل القبلة كان إلى:", options: ["بيت المقدس دائماً", "الكعبة", "الطائف", "لا قبلة"], correctIndex: 1, explanation: "البيت الحرام.", source: "البقرة / البخاري" },
  { id: "sd3", quizId: "seerah-madinah", category: "seerah", question: "صلح الحديبية كان في سنة:", options: ["1 هـ", "6 هـ", "11 هـ", "20 هـ"], correctIndex: 1, explanation: "ستة هجرية.", source: "ابن هشام" },
  { id: "sd4", quizId: "seerah-madinah", category: "seerah", question: "فتح مكة كان في:", options: ["2 هـ", "8 هـ", "11 هـ", "قبل الهجرة"], correctIndex: 1, explanation: "ثمان هجرية.", source: "الرحيق المختوم" },
  { id: "sd5", quizId: "seerah-madinah", category: "seerah", question: "حجة الوداع في سنة:", options: ["1 هـ", "5 هـ", "10 هـ", "12 هـ"], correctIndex: 2, explanation: "عشر هجرية.", source: "صحيح مسلم" },
  { id: "sd6", quizId: "seerah-madinah", category: "seerah", question: "توفي النبي ﷺ في:", options: ["مكة", "المدينة", "بدر", "تبوك"], correctIndex: 1, explanation: "المدينة.", source: "البخاري" },
  { id: "sd7", quizId: "seerah-madinah", category: "seerah", question: "وثيقة المدينة هدفت إلى:", options: ["إلغاء الإسلام", "تنظيم العلاقة بين سكان المدينة", "محو الأنصار", "منع الصلاة"], correctIndex: 1, explanation: "عقد مجتمعي.", source: "ابن هشام" },
  { id: "sd8", quizId: "seerah-madinah", category: "seerah", question: "غزوة تبوك كانت في:", options: ["2 هـ", "9 هـ", "قبل البعثة", "20 هـ"], correctIndex: 1, explanation: "تسعة هجرية.", source: "ابن هشام" },

  // ===== seerah-battles =====
  { id: "sb1", quizId: "seerah-battles", category: "seerah", question: "غزوة بدر في سنة:", options: ["1 هـ", "2 هـ", "8 هـ", "10 هـ"], correctIndex: 1, explanation: "اثنتين هجرية.", source: "الرحيق المختوم" },
  { id: "sb2", quizId: "seerah-battles", category: "seerah", question: "سُمّيت بدر بـ:", options: ["يوم الفرقان", "يوم الحديبية", "يوم الفتح فقط", "يوم الهجرة"], correctIndex: 0, explanation: "في القرآن.", source: "الأنفال" },
  { id: "sb3", quizId: "seerah-battles", category: "seerah", question: "في أحد أُصيب النبي ﷺ و:", options: ["انتصر المسلمون بلا خسائر", "استُشهد حمزة رضي الله عنه", "لم يحدث قتال", "فتحت مكة"], correctIndex: 1, explanation: "من أحداث أحد.", source: "ابن هشام" },
  { id: "sb4", quizId: "seerah-battles", category: "seerah", question: "الخندق كان اقتراحاً من:", options: ["أبي جهل", "سلمان الفارسي", "هرقل", "كسرى"], correctIndex: 1, explanation: "سلمان.", source: "ابن هشام" },
  { id: "sb5", quizId: "seerah-battles", category: "seerah", question: "فتح مكة تميّز بـ:", options: ["القتل العام", "العفو العام عن أهل مكة", "هدم الكعبة", "إلغاء الحج"], correctIndex: 1, explanation: "عفو النبي ﷺ.", source: "الرحيق المختوم" },
  { id: "sb6", quizId: "seerah-battles", category: "seerah", question: "غزوة مؤتة كانت ضد:", options: ["قريش داخل مكة", " الروم وحلفائهم", "فارس في المدائن", "ثقيف فقط"], correctIndex: 1, explanation: "مؤتة.", source: "ابن هشام" },

  // ===== adhkar-day =====
  { id: "ad1", quizId: "adhkar-day", category: "adhkar", question: "من أذكار الصباح:", options: ["أذكار لا أصل لها فقط", "أصبحنا وأصبح الملك لله…", "لا يوجد ذكر صباح", "التهجد بدل الذكر"], correctIndex: 1, explanation: "مروي في مسلم وغيره.", source: "حصن المسلم" },
  { id: "ad2", quizId: "adhkar-day", category: "adhkar", question: "سيد الاستغفار يبدأ بـ:", options: ["سبحان الله فقط", "اللهم أنت ربي لا إله إلا أنت…", "لا حول فقط", "التكبير فقط"], correctIndex: 1, explanation: "حديث البخاري.", source: "حصن المسلم" },
  { id: "ad3", quizId: "adhkar-day", category: "adhkar", question: "قراءة المعوذات عند النوم:", options: ["لا تُشرع", "ثابتة مع النفث في الكفين", "مكروهة", "خاصة بالسفر فقط"], correctIndex: 1, explanation: "من السنة.", source: "البخاري / حصن المسلم" },
  { id: "ad4", quizId: "adhkar-day", category: "adhkar", question: "كلمة الإخلاص «لا إله إلا الله» عظيمة لأنها:", options: ["كلمة عادية", "أساس التوحيد", "لا فضل لها", "خاصة بالليل فقط"], correctIndex: 1, explanation: "كلمة التوحيد.", source: "الأذكار / الحديث" },
  { id: "ad5", quizId: "adhkar-day", category: "adhkar", question: "من أذكار المساء:", options: ["أمسينا وأمسى الملك لله", "لا ذكر للمساء", "الذكر بعد الوتر فقط", "التكبير بدل كل شيء"], correctIndex: 0, explanation: "مروي.", source: "حصن المسلم" },
  { id: "ad6", quizId: "adhkar-day", category: "adhkar", question: "آية الكرسي بعد الصلاة المكتوبة:", options: ["لا أصل", "ورد فيها فضل عظيم في أحاديث", "محرمة", "خاصة برمضان"], correctIndex: 1, explanation: "يُعمل بما صح من فضلها.", source: "النسائي وغيره / حصن المسلم" },

  // ===== adhkar-prayer =====
  { id: "ap1", quizId: "adhkar-prayer", category: "adhkar", question: "بعد السلام من الصلاة يُستحب:", options: ["الصمت دائماً", "الاستغفار ثلاثاً ثم اللهم أنت السلام…", "ترك الذكر", "القيام فوراً بلا ذكر"], correctIndex: 1, explanation: "ثابت عن النبي ﷺ.", source: "مسلم / حصن المسلم" },
  { id: "ap2", quizId: "adhkar-prayer", category: "adhkar", question: "التسبيح والتحميد والتكبير بعد الصلاة:", options: ["33 و33 و33", "مرة واحدة فقط", "لا يشرع", "1000 لكل منها حتماً"], correctIndex: 0, explanation: "المشهور 33.", source: "مسلم" },
  { id: "ap3", quizId: "adhkar-prayer", category: "adhkar", question: "دعاء الاستفتاح يكون:", options: ["بعد السلام", "بعد تكبيرة الإحرام قبل الفاتحة", "في الركوع فقط", "لا يوجد"], correctIndex: 1, explanation: "مواضع مروية.", source: "البخاري / الأذكار" },
  { id: "ap4", quizId: "adhkar-prayer", category: "adhkar", question: "التشهد الأخير يتضمن:", options: ["الصلاة على النبي ﷺ", "لا شيء سوى السلام", "السكوت فقط", "قراءة البقرة كاملة"], correctIndex: 0, explanation: "الصلاة الإبراهيمية.", source: "البخاري" },
  { id: "ap5", quizId: "adhkar-prayer", category: "adhkar", question: "من أدعية الركوع:", options: ["سبحان ربي العظيم", "سبحان ربي الأعلى فقط", "لا ذكر", "التكبير بدل التسبيح حتماً"], correctIndex: 0, explanation: "ثابت.", source: "مسلم" },

  // ===== quran-basics =====
  { id: "qb1", quizId: "quran-basics", category: "quran", question: "عدد سور القرآن:", options: ["100", "114", "120", "99"], correctIndex: 1, explanation: "114 سورة.", source: "مباحث في علوم القرآن" },
  { id: "qb2", quizId: "quran-basics", category: "quran", question: "أول سورة في المصحف:", options: ["البقرة", "الفاتحة", "العلق", "الناس"], correctIndex: 1, explanation: "الفاتحة.", source: "المصحف" },
  { id: "qb3", quizId: "quran-basics", category: "quran", question: "آخر سورة في ترتيب المصحف:", options: ["الكوثر", "الناس", "الإخلاص", "الفلق"], correctIndex: 1, explanation: "الناس.", source: "المصحف" },
  { id: "qb4", quizId: "quran-basics", category: "quran", question: "السور المكية غالباً تُعنى بـ:", options: ["الأحكام التفصيلية فقط", "العقيدة واليوم الآخر", "الزكاة فقط", "الحدود فقط"], correctIndex: 1, explanation: "طابع مكي معروف.", source: "علوم القرآن" },
  { id: "qb5", quizId: "quran-basics", category: "quran", question: "أطول سورة:", options: ["الفاتحة", "البقرة", "الكوثر", "العصر"], correctIndex: 1, explanation: "البقرة.", source: "علوم القرآن" },
  { id: "qb6", quizId: "quran-basics", category: "quran", question: "أقصر سورة:", options: ["البقرة", "الكوثر", "آل عمران", "النساء"], correctIndex: 1, explanation: "الكوثر.", source: "علوم القرآن" },
  { id: "qb7", quizId: "quran-basics", category: "quran", question: "جمع القرآن في مصحف واحد في عهد:", options: ["أبي بكر ثم عثمان رضي الله عنهما", "بعد العباسيين فقط", "لم يجمع", "في مكة قبل الهجرة"], correctIndex: 0, explanation: "مشهور في التاريخ.", source: "البخاري / علوم القرآن" },
  { id: "qb8", quizId: "quran-basics", category: "quran", question: "عدد أحزاب القرآن المشهورة:", options: ["10", "30", "60", "114"], correctIndex: 2, explanation: "ستون حزباً في المشهور.", source: "اصطلاح المصاحف" },

  // ===== quran-ahkam =====
  { id: "qa1", quizId: "quran-ahkam", category: "quran", question: "من آداب حامل القرآن:", options: ["الإخلاص وتعاهده", "هجره تماماً", "قراءته بلا وضوء للمس المصحف عند من يشترط", "عدم تدبره"], correctIndex: 0, explanation: "تعاهده والإخلاص.", source: "التبيان للنووي" },
  { id: "qa2", quizId: "quran-ahkam", category: "quran", question: "الاستعاذة عند القراءة:", options: ["محرمة", "مشروعة", "مبتدعة", "خاصة بالليل"], correctIndex: 1, explanation: "النحل 98.", source: "التجويد الميسر" },
  { id: "qa3", quizId: "quran-ahkam", category: "quran", question: "البسملة في أوائل السور:", options: ["لا تُكتب في شيء", "ثابتة إلا التوبة", "فقط في الفاتحة", "محذوفة دائماً"], correctIndex: 1, explanation: "عدا براءة.", source: "علوم القرآن" },
  { id: "qa4", quizId: "quran-ahkam", category: "quran", question: "الترتيل يعني:", options: ["السرعة المفرطة", "التؤدة وتبيين الحروف", "اللحن بالمعاصي", "ترك المخارج"], correctIndex: 1, explanation: "ورتل القرآن ترتيلا.", source: "التجويد الميسر" },
  { id: "qa5", quizId: "quran-ahkam", category: "quran", question: "نسيان القرآن:", options: ["لا يُنهى عن التفريط فيه", "يُحذَّر من هجره وترك تعاهده", "مستحب", "واجب"], correctIndex: 1, explanation: "تعاهدوا القرآن.", source: "البخاري" },

  // ===== fiqh-taharah =====
  { id: "ft1", quizId: "fiqh-taharah", category: "fiqh", question: "فروض الوضوء عند الجمهور تشمل:", options: ["غسل الوجه واليدين ومسح الرأس وغسل الرجلين", "المضمضة فقط", "مسح الخفين دون سبب", "لا فروض"], correctIndex: 0, explanation: "المائدة 6.", source: "الفقه الميسر" },
  { id: "ft2", quizId: "fiqh-taharah", category: "fiqh", question: "ينقض الوضوء:", options: ["الابتسام", "خروج الحدث من السبيلين", "التفكير", "المشي"], correctIndex: 1, explanation: "مبطلات معروفة.", source: "الفقه الميسر" },
  { id: "ft3", quizId: "fiqh-taharah", category: "fiqh", question: "التيمم يكون عند:", options: ["وجود الماء دائماً", "فقد الماء أو العجز عن استعماله", "كل صلاة حتماً مع وجود الماء", "لا يشرع"], correctIndex: 1, explanation: "رخصة.", source: "الفقه الميسر" },
  { id: "ft4", quizId: "fiqh-taharah", category: "fiqh", question: "الغسل يجب بـ:", options: ["النوم فقط", "الجنابة والحيض والنفاس ونحوها", "الضحكة", "الكلام"], correctIndex: 1, explanation: "موجبات الغسل.", source: "الفقه الميسر" },
  { id: "ft5", quizId: "fiqh-taharah", category: "fiqh", question: "الماء الطهور هو:", options: ["النجس", "الباقي على أصل خلقته", "المتغير بنجاسة", "لا يوجد"], correctIndex: 1, explanation: "يُرفع به الحدث.", source: "الفقه الميسر" },
  { id: "ft6", quizId: "fiqh-taharah", category: "fiqh", question: "المسح على الخفين:", options: ["لا يجوز أبداً", "جائز بشروطه للمقيم والمسافر", "واجب دائماً", "للنساء فقط"], correctIndex: 1, explanation: "رخصة ثابتة.", source: "عمدة الأحكام" },

  // ===== fiqh-salah =====
  { id: "fs1", quizId: "fiqh-salah", category: "fiqh", question: "عدد الصلوات المفروضة يومياً:", options: ["3", "5", "7", "2"], correctIndex: 1, explanation: "خمس.", source: "حديث جبريل" },
  { id: "fs2", quizId: "fiqh-salah", category: "fiqh", question: "من أركان الصلاة:", options: ["الالتفات لغير حاجة كركن", "تكبيرة الإحرام والركوع والسجود", "رفع اليدين في كل حركة كركن عند الجميع", "الدعاء بعد السلام كركن"], correctIndex: 1, explanation: "أركان متفق على أصولها.", source: "الفقه الميسر" },
  { id: "fs3", quizId: "fiqh-salah", category: "fiqh", question: "استقبال القبلة:", options: ["مستحب فقط", "شرط من شروط الصلاة", "محرم", "لصلاة الليل فقط"], correctIndex: 1, explanation: "شرط.", source: "الفقه الميسر" },
  { id: "fs4", quizId: "fiqh-salah", category: "fiqh", question: "صلاة الجماعة:", options: ["لا فضل لها", "لها فضل عظيم على صلاة المنفرد", "مكروهة", "منسوخة"], correctIndex: 1, explanation: "بسبع وعشرين درجة.", source: "البخاري" },
  { id: "fs5", quizId: "fiqh-salah", category: "fiqh", question: "أقل الوتر:", options: ["ثلاث فقط حتماً", "ركعة", "خمس حتماً", "لا وتر"], correctIndex: 1, explanation: "ركعة أقلّه.", source: "السنة" },
  { id: "fs6", quizId: "fiqh-salah", category: "fiqh", question: "تارك الصلاة كسلاً:", options: ["لا إثم", "على خطر عظيم ويُناصح ويُعلَّم", "مأجور", "مستحب"], correctIndex: 1, explanation: "الصلاة عمود الدين.", source: "الفقه / الحديث" },

  // ===== fiqh-siyam =====
  { id: "fy1", quizId: "fiqh-siyam", category: "fiqh", question: "من مفطرات الصوم:", options: ["الغيبة وحدها عند الجمهور كالأكل", "الأكل والشرب عمداً", "النوم", "السكوت"], correctIndex: 1, explanation: "الأكل والشرب عمداً.", source: "عمدة الأحكام" },
  { id: "fy2", quizId: "fiqh-siyam", category: "fiqh", question: "زكاة الفطر تُخرج:", options: ["بعد صلاة العيد فقط عند الجميع", "قبل صلاة العيد", "في رجب فقط", "لا تجب"], correctIndex: 1, explanation: "قبل الصلاة.", source: "عمدة الأحكام" },
  { id: "fy3", quizId: "fiqh-siyam", category: "fiqh", question: "الربا:", options: ["مكروه فقط", "محرم", "جائز للحاجة المطلقة", "مندوب"], correctIndex: 1, explanation: "محرم بنص الكتاب.", source: "البقرة" },
  { id: "fy4", quizId: "fiqh-siyam", category: "fiqh", question: "من أركان الحج عند الجمهور:", options: ["رمي الجمار فقط", "الوقوف بعرفة", "المبيت بمنى فقط لكل أحد كركن", "ذبح الهدي لكل حاج كركن"], correctIndex: 1, explanation: "عرفة.", source: "الفقه الميسر" },
  { id: "fy5", quizId: "fiqh-siyam", category: "fiqh", question: "نصاب الزكاة في النقدين:", options: ["لا نصاب", "مقدار معلوم متى بلغ وحال عليه الحول", "كل ريال", "للأغنياء فقط بلا شرط"], correctIndex: 1, explanation: "نصاب وحول.", source: "الفقه الميسر" },
  { id: "fy6", quizId: "fiqh-siyam", category: "fiqh", question: "من أُفطر في رمضان لعذر شرعي:", options: ["لا قضاء", "يقضي عند القدرة", "يكفّر دائماً دون قضاء", "يُمنع من الصيام"], correctIndex: 1, explanation: "القضاء.", source: "البقرة 184" },

  // ===== hadith-nawawi =====
  { id: "hn1", quizId: "hadith-nawawi", category: "hadith", question: "«إنما الأعمال بالنيات»:", options: ["ضعيف", "متفق عليه", "موضوع", "موقوف"], correctIndex: 1, explanation: "متفق عليه.", source: "البخاري ومسلم" },
  { id: "hn2", quizId: "hadith-nawawi", category: "hadith", question: "بني الإسلام على:", options: ["ثلاث", "خمس", "سبع", "عشر"], correctIndex: 1, explanation: "خمس.", source: "البخاري ومسلم" },
  { id: "hn3", quizId: "hadith-nawawi", category: "hadith", question: "«من أحدث في أمرنا هذا ما ليس منه فهو رد» يدل على:", options: ["إباحة البدع", "رد البدعة", "نسخ السنة", "ترك العمل"], correctIndex: 1, explanation: "حماية التشريع.", source: "البخاري ومسلم" },
  { id: "hn4", quizId: "hadith-nawawi", category: "hadith", question: "عدد أحاديث الأربعين النووية تقريباً:", options: ["20", "30", "42", "100"], correctIndex: 2, explanation: "حول اثنين وأربعين.", source: "الأربعون النووية" },
  { id: "hn5", quizId: "hadith-nawawi", category: "hadith", question: "حديث جبريل في الإيمان والإسلام والإحسان رواه:", options: ["البخاري فقط", "مسلم", "الترمذي فقط", "موضوع"], correctIndex: 1, explanation: "في صحيح مسلم.", source: "مسلم" },
  { id: "hn6", quizId: "hadith-nawawi", category: "hadith", question: "«لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه»:", options: ["ضعيف", "متفق عليه", "حسن فقط", "منقطع"], correctIndex: 1, explanation: "متفق عليه.", source: "البخاري ومسلم" },
  { id: "hn7", quizId: "hadith-nawawi", category: "hadith", question: "«الدين النصيحة»:", options: ["موضوع", "صحيح", "ضعيف جداً", "إسرائيلي"], correctIndex: 1, explanation: "مسلم.", source: "مسلم" },
  { id: "hn8", quizId: "hadith-nawawi", category: "hadith", question: "«لا ضرر ولا ضرار»:", options: ["لا أصل له", "قاعدة حديثية يعمل بها أهل العلم", "منسوخ", "خاص بالبيع فقط دون معنى"], correctIndex: 1, explanation: "ابن ماجه وغيره.", source: "ابن ماجه" },

  // ===== hadith-riyad =====
  { id: "hr1", quizId: "hadith-riyad", category: "hadith", question: "«المسلم من سلم المسلمون من لسانه ويده»:", options: ["موضوع", "متفق عليه", "ضعيف", "موقوف"], correctIndex: 1, explanation: "متفق عليه.", source: "البخاري ومسلم" },
  { id: "hr2", quizId: "hadith-riyad", category: "hadith", question: "من لا يشكر الناس:", options: ["يشكر الله فقط بلا علاقة", "لا يشكر الله", "كافر حتماً", "لا حديث فيه"], correctIndex: 1, explanation: "حديث مشهور.", source: "الترمذي" },
  { id: "hr3", quizId: "hadith-riyad", category: "hadith", question: "الراحمون:", options: ["لا يُرحمون", "يرحمهم الرحمن", "بعيدون عن الرحمة", "لا فضل لهم"], correctIndex: 1, explanation: "ارحموا من في الأرض.", source: "أبو داود والترمذي" },
  { id: "hr4", quizId: "hadith-riyad", category: "hadith", question: "خيركم من تعلم القرآن:", options: ["وعلّمه", "وتركه", "وحفظه دون عمل", "دون تعليم"], correctIndex: 0, explanation: "البخاري.", source: "البخاري" },
  { id: "hr5", quizId: "hadith-riyad", category: "hadith", question: "آية المنافق ثلاث منها:", options: ["إذا حدّث كذب", "إذا صام أفطر سراً دائماً", "إذا حجّ تأخر", "إذا تيمم"], correctIndex: 0, explanation: "الحديث المتفق عليه.", source: "البخاري ومسلم" },
  { id: "hr6", quizId: "hadith-riyad", category: "hadith", question: "الطهور:", options: ["شطر الإيمان", "لا علاقة له بالإيمان", "مكروه", "منسوخ"], correctIndex: 0, explanation: "مسلم.", source: "مسلم" },

  // ===== aqidah-iman =====
  { id: "ai1", quizId: "aqidah-iman", category: "aqidah", question: "أركان الإيمان:", options: ["خمسة كأركان الإسلام تماماً", "ستة", "ثلاثة فقط", "عشرة"], correctIndex: 1, explanation: "ستة في حديث جبريل.", source: "مسلم" },
  { id: "ai2", quizId: "aqidah-iman", category: "aqidah", question: "الإيمان بالملائكة:", options: ["مستحب فقط", "ركن من أركان الإيمان", "مبتدع", "خاص بالأنبياء"], correctIndex: 1, explanation: "ركن.", source: "حديث جبريل" },
  { id: "ai3", quizId: "aqidah-iman", category: "aqidah", question: "الكتب المنزلة:", options: ["لا نؤمن بها", "الإيمان بها ركن", "التوراة فقط", "القرآن دون غيرها مطلقاً دون إيمان مجمل"], correctIndex: 1, explanation: "الإيمان بالكتب.", source: "حديث جبريل" },
  { id: "ai4", quizId: "aqidah-iman", category: "aqidah", question: "اليوم الآخر:", options: ["ينكره المؤمن", "الإيمان به واجب", "قصة رمزية فقط عند أهل السنة", "لا يُذكر في القرآن"], correctIndex: 1, explanation: "ركن.", source: "القرآن / حديث جبريل" },
  { id: "ai5", quizId: "aqidah-iman", category: "aqidah", question: "القدر:", options: ["لا إيمان به", "الإيمان به من أركان الإيمان", "بدعة", "يُنفى عن أفعال العباد نفياً مطلقاً عند أهل السنة"], correctIndex: 1, explanation: "ركن سادس.", source: "مسلم" },
  { id: "ai6", quizId: "aqidah-iman", category: "aqidah", question: "الإيمان بالرسل:", options: ["بمحمد ﷺ فقط دون من سبق", "بجميع من سمّى الله ومن لم يُسمَّ على الإجمال", "لا يجب", "بالأنبياء العرب فقط"], correctIndex: 1, explanation: "ركن.", source: "حديث جبريل" },

  // ===== aqidah-tawhid =====
  { id: "at1", quizId: "aqidah-tawhid", category: "aqidah", question: "توحيد الربوبية هو:", options: ["إفراد الله بالعبادة", "الإقرار بأن الله هو الخالق المالك المدبر", "إنكار الأسماء", "عبادة القبور"], correctIndex: 1, explanation: "ربوبية.", source: "الأصول الثلاثة" },
  { id: "at2", quizId: "aqidah-tawhid", category: "aqidah", question: "توحيد الألوهية هو:", options: ["إفراد الله بالعبادة", "الإقرار بالخلق فقط دون عبادة", "إنكار البعث", "التوسل الممنوع"], correctIndex: 0, explanation: "لا يعبد إلا الله.", source: "الأصول الثلاثة" },
  { id: "at3", quizId: "aqidah-tawhid", category: "aqidah", question: "من أنواع التوحيد:", options: ["الربوبية والألوهية والأسماء والصفات", "نوع واحد فقط بلا تفصيل", "توحيد الأشخاص", "لا أنواع"], correctIndex: 0, explanation: "تقسيم مشهور عند أهل العلم.", source: "كتاب التوحيد" },
  { id: "at4", quizId: "aqidah-tawhid", category: "aqidah", question: "الشرك الأكبر:", options: ["لا يخرج من الملة أبداً", "يصرف العبادة لغير الله", "مستحب", "مكروه فقط"], correctIndex: 1, explanation: "أعظم الذنوب.", source: "كتاب التوحيد" },
  { id: "at5", quizId: "aqidah-tawhid", category: "aqidah", question: "معنى لا إله إلا الله:", options: ["لا خالق إلا الله فقط دون نفي العبادة عن غيره", "لا معبود بحق إلا الله", "لا موجود إلا الله بمعنى حلول", "إثبات الشريك"], correctIndex: 1, explanation: "نفي وإثبات.", source: "الأصول الثلاثة" },
  { id: "at6", quizId: "aqidah-tawhid", category: "aqidah", question: "الإيمان بأسماء الله وصفاته عند أهل السنة:", options: ["تعطيلها", "إثبات ما ثبت بلا تحريف ولا تمثيل", "تشبيه الله بخلقه", "إنكارها"], correctIndex: 1, explanation: "منهج السلف.", source: "العقيدة الواسطية / كتب التوحيد" },
];

export const QUIZ_PACKS: QuizPack[] = [...BASE_PACKS, ...QUIZ_EXTRA_PACKS];
export const QUIZ_QUESTIONS: QuizQuestion[] = [...BASE_QUESTIONS, ...QUIZ_EXTRA_QUESTIONS];

export function getQuestionsByCategory(cat: string) {
  if (cat === "all") return QUIZ_QUESTIONS;
  return QUIZ_QUESTIONS.filter((q) => q.category === cat);
}

export function getQuestionsByQuiz(quizId: string) {
  return QUIZ_QUESTIONS.filter((q) => q.quizId === quizId);
}

export function getPacksByCategory(cat: string) {
  if (cat === "all") return QUIZ_PACKS;
  return QUIZ_PACKS.filter((p) => p.category === cat);
}

export function getQuizPack(id: string) {
  return QUIZ_PACKS.find((p) => p.id === id);
}
