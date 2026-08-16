import type { BpscQuestionFigureCrop, BpscTre4Question } from "@/lib/bpsc-tre-4-series";

export type BpscTre4OnlineQuestion = BpscTre4Question & {
  sourceImage: string;
  sourcePage: number;
  figure?: BpscQuestionFigureCrop;
};

const pair = (english: string, hindi: string): [string, string] => [english, hindi];
const options = (...values: Array<[string, string]>) => values;
const figureSizes: Record<string, [number, number, [string, string]]> = {
  "2-04": [354, 374, pair("Three compound dielectric slabs between capacitor plates", "संधारित्र प्लेटों के बीच तीन संयुक्त परावैद्युत पट्टियाँ")],
  "2-06": [419, 244, pair("Charged pendulum between parallel plates", "समांतर प्लेटों के बीच आवेशित लोलक")],
  "2-07": [449, 314, pair("Capacitor network between points A, B and C", "A, B और C बिंदुओं के बीच संधारित्र नेटवर्क")],
  "2-08": [569, 334, pair("Circuit for current I3", "धारा I3 का परिपथ")],
  "2-09": [584, 329, pair("Circuit containing unknown resistance X", "अज्ञात प्रतिरोध X वाला परिपथ")],
  "2-10": [469, 364, pair("Parallel source circuit with a 5 ohm resistor", "5 ओम प्रतिरोध वाला समांतर स्रोत परिपथ")],
  "2-11": [389, 354, pair("Network of currents", "धाराओं का नेटवर्क")],
  "2-13": [494, 309, pair("Metre bridge circuit", "मीटर ब्रिज परिपथ")],
  "2-15": [359, 294, pair("Current-carrying loop centred at O", "O केंद्र वाला धारावाही लूप")],
  "2-18": [584, 319, pair("Three long parallel current-carrying wires", "तीन लंबी समांतर धारावाही तारें")],
  "2-19": [884, 734, pair("Four bar-magnet configurations A, B, C and D", "छड़ चुंबकों के चार विन्यास A, B, C और D")],
  "2-20": [604, 314, pair("Four lowest hydrogen energy levels", "हाइड्रोजन के चार न्यूनतम ऊर्जा स्तर")],
  "2-24": [899, 599, pair("Four PN-junction carrier-flow diagrams", "PN जंक्शन में वाहक प्रवाह के चार चित्र")],
  "2-26": [399, 454, pair("Disc rolling without slipping with points A, B and C", "A, B और C बिंदुओं वाली बिना फिसले लुढ़कती डिस्क")],
  "2-28": [459, 349, pair("Floating block in an upward-accelerating liquid", "ऊपर की ओर त्वरित द्रव में तैरता खंड")],
};

const figureCrops: Record<string, BpscQuestionFigureCrop> = Object.fromEntries(
  Object.entries(figureSizes).map(([id, [width, height, alt]]) => [id, {
    x: 0,
    y: 0,
    width,
    height,
    sourceWidth: width,
    sourceHeight: height,
    alt,
  }]),
);

const q = (
  id: string,
  page: number,
  question: [string, string],
  choices: Array<[string, string]>,
  correctOption: number,
  explanation: [string, string],
  showSource = false,
): BpscTre4OnlineQuestion => ({
  id,
  question,
  options: choices,
  correctOption,
  explanation,
  sourceImage: showSource ? `/bpsc-tre-4/test-2-figures/${id}.png` : "",
  sourcePage: page,
  figure: showSource ? figureCrops[id] : undefined,
});

const test2Questions: BpscTre4OnlineQuestion[] = [
  q("2-01", 1, pair("The electrostatic potential inside a charged spherical ball is φ = ar² + b, where r is distance from the centre and a, b are constants. The charge density inside the ball is:", "आवेशित गोलाकार पिंड के भीतर वैद्युत विभव φ = ar² + b है, जहाँ r केंद्र से दूरी तथा a, b नियतांक हैं। पिंड के भीतर आवेश घनत्व है:"), options(pair("−24πε₀ar", "−24πε₀ar"), pair("−6aε₀r", "−6aε₀r"), pair("−24πε₀a", "−24πε₀a"), pair("−6aε₀", "−6aε₀")), 3, pair("Using Poisson's equation, ρ = −ε₀∇²φ. Since ∇²(ar²) = 6a, ρ = −6aε₀.", "पॉइसन समीकरण ρ = −ε₀∇²φ तथा ∇²(ar²) = 6a से ρ = −6aε₀।")),
  q("2-02", 1, pair("A charge Q is enclosed by a Gaussian spherical surface of radius R. If the radius is doubled, the outward electric flux will:", "त्रिज्या R के गाउसीय गोलाकार पृष्ठ में आवेश Q बंद है। त्रिज्या दोगुनी करने पर बाहरी विद्युत फ्लक्स:"), options(pair("Be doubled", "दोगुना होगा"), pair("Increase four times", "चार गुना होगा"), pair("Be reduced to half", "आधा होगा"), pair("Remain the same", "समान रहेगा")), 3, pair("Gauss's law gives total flux Q/ε₀, independent of the radius.", "गाउस नियम के अनुसार कुल फ्लक्स Q/ε₀ है और त्रिज्या पर निर्भर नहीं करता।")),
  q("2-03", 1, pair("What is the electric flux through a cube of side a if a point charge q is at one of its corners?", "यदि a भुजा वाले घन के एक कोने पर बिंदु आवेश q हो, तो घन से गुजरने वाला विद्युत फ्लक्स कितना है?"), options(pair("2q/ε₀", "2q/ε₀"), pair("q/(8ε₀)", "q/(8ε₀)"), pair("q/ε₀", "q/ε₀"), pair("3q a²/(2ε₀)", "3q a²/(2ε₀)")), 1, pair("Eight identical cubes can surround the corner charge, so one cube receives one-eighth of q/ε₀.", "कोने के आवेश के चारों ओर आठ समान घन रखे जा सकते हैं, इसलिए एक घन का फ्लक्स q/(8ε₀) है।")),
  q("2-04", 2, pair("For three dielectric slabs of thicknesses d₁, d₂, d₃ and dielectric constants K₁, K₂, K₃ placed between parallel plates of area A, the capacitance is:", "क्षेत्रफल A की समांतर प्लेटों के बीच d₁, d₂, d₃ मोटाई और K₁, K₂, K₃ परावैद्युतांक की तीन पट्टियाँ रखी हैं। धारिता है:"), options(pair("ε₀A/(d₁+d₂+d₃)", "ε₀A/(d₁+d₂+d₃)"), pair("ε₀A/(d₁/K₁+d₂/K₂+d₃/K₃)", "ε₀A/(d₁/K₁+d₂/K₂+d₃/K₃)"), pair("ε₀A K₁K₂K₃/(d₁d₂d₃)", "ε₀A K₁K₂K₃/(d₁d₂d₃)"), pair("(A/ε₀)(K₁/d₁+K₂/d₂+K₃/d₃)", "(A/ε₀)(K₁/d₁+K₂/d₂+K₃/d₃)")), 1, pair("The slabs behave like capacitors in series; their effective electrical thickness is Σ(dᵢ/Kᵢ).", "पट्टियाँ श्रेणीक्रम के संधारित्रों जैसी हैं; प्रभावी विद्युत मोटाई Σ(dᵢ/Kᵢ) है।"), true),
  q("2-05", 2, pair("The electric-field intensity at a point between the plates of an isolated charged capacitor:", "एक आवेशित पृथक संधारित्र की प्लेटों के बीच किसी बिंदु पर विद्युत क्षेत्र की तीव्रता:"), options(pair("Is directly proportional to plate separation", "प्लेट दूरी के समानुपाती है"), pair("Is inversely proportional to plate separation", "प्लेट दूरी के व्युत्क्रमानुपाती है"), pair("Is inversely proportional to the square of plate separation", "प्लेट दूरी के वर्ग के व्युत्क्रमानुपाती है"), pair("Does not depend on plate separation", "प्लेट दूरी पर निर्भर नहीं करती")), 3, pair("For fixed charge, E = σ/ε₀, so changing the plate separation does not change E.", "नियत आवेश के लिए E = σ/ε₀, इसलिए प्लेट दूरी बदलने से E नहीं बदलता।")),
  q("2-06", 3, pair("A charged sphere of mass m hangs as a pendulum of length L between horizontal parallel plates. Its period is T₀ before charging the plates and T after an electric field E is established downward. The ratio T/T₀ is:", "m द्रव्यमान और q आवेश वाला गोला क्षैतिज समांतर प्लेटों के बीच L लंबाई के लोलक से लटका है। प्लेटों को आवेशित करने से पहले आवर्तकाल T₀ और नीचे की ओर विद्युत क्षेत्र E बनने के बाद T है। T/T₀ है:"), options(pair("√[(g+qE/m)/g]", "√[(g+qE/m)/g]"), pair("[g/(g+qE/m)]³ᐟ²", "[g/(g+qE/m)]³ᐟ²"), pair("√[g/(g+qE/m)]", "√[g/(g+qE/m)]"), pair("None of these", "इनमें से कोई नहीं")), 2, pair("The effective acceleration is g+qE/m. Since T ∝ 1/√g_eff, T/T₀ = √[g/(g+qE/m)].", "प्रभावी त्वरण g+qE/m है। T ∝ 1/√g_eff से T/T₀ = √[g/(g+qE/m)]।"), true),
  q("2-07", 4, pair("In the shown capacitor network, what are VAB and VBC respectively in steady state?", "दिए गए संधारित्र नेटवर्क में स्थायी अवस्था में क्रमशः VAB और VBC कितने हैं?"), options(pair("100 V, 100 V", "100 V, 100 V"), pair("75 V, 25 V", "75 V, 25 V"), pair("25 V, 75 V", "25 V, 75 V"), pair("50 V, 50 V", "50 V, 50 V")), 2, pair("The effective capacitances across AB and BC are 6 μF and 2 μF. Charge neutrality at B divides 100 V as 25 V and 75 V.", "AB और BC के बीच प्रभावी धारिताएँ 6 μF और 2 μF हैं। B पर आवेश-तटस्थता से 100 V क्रमशः 25 V और 75 V में बँटता है।"), true),
  q("2-08", 5, pair("For the circuit shown, the current I₃ (positive downward as marked) is:", "दिए गए परिपथ में I₃ धारा (चित्र में नीचे की दिशा धनात्मक) है:"), options(pair("5 A", "5 A"), pair("3 A", "3 A"), pair("−3 A", "−3 A"), pair("−5/6 A", "−5/6 A")), 3, pair("Applying Kirchhoff's laws to the two loops gives a net 5/6 A upward through the central branch, hence I₃ = −5/6 A.", "दोनों लूपों पर किर्चॉफ नियम लगाने से मध्य शाखा में 5/6 A ऊपर की ओर धारा मिलती है, अतः I₃ = −5/6 A।"), true),
  q("2-09", 5, pair("If VAB = 4 V in the shown circuit, the resistance X is:", "दिए गए परिपथ में यदि VAB = 4 V हो, तो प्रतिरोध X है:"), options(pair("5 Ω", "5 Ω"), pair("10 Ω", "10 Ω"), pair("15 Ω", "15 Ω"), pair("20 Ω", "20 Ω")), 3, pair("The upper branch gives loop current magnitude 0.1 A. Using the 2 V cell and 4 V terminal voltage in the lower branch gives X = 20 Ω.", "ऊपरी शाखा से धारा का परिमाण 0.1 A मिलता है। निचली शाखा में 2 V सेल और 4 V टर्मिनल वोल्टेज से X = 20 Ω।"), true),
  q("2-10", 5, pair("In the shown circuit, the current through the 5 Ω resistor is:", "दिए गए परिपथ में 5 Ω प्रतिरोध से गुजरने वाली धारा है:"), options(pair("8/3 A", "8/3 A"), pair("9/13 A", "9/13 A"), pair("4/13 A", "4/13 A"), pair("1/3 A", "1/3 A"), pair("2/3 A", "2/3 A")), 3, pair("The two identical 2 V, 2 Ω branches are equivalent to a 2 V source with 1 Ω internal resistance. With the 5 Ω load, I = 2/6 = 1/3 A.", "दो समान 2 V, 2 Ω शाखाएँ 2 V स्रोत और 1 Ω आंतरिक प्रतिरोध के तुल्य हैं। 5 Ω भार के साथ I = 2/6 = 1/3 A।"), true),
  q("2-11", 6, pair("The shown network carries the marked currents. The current I is:", "दिए गए नेटवर्क में चिह्नित धाराएँ बह रही हैं। धारा I है:"), options(pair("3 A", "3 A"), pair("9 A", "9 A"), pair("13 A", "13 A"), pair("19 A", "19 A")), 2, pair("For the complete network, total incoming current is 10+1+2 = 13 A, which must leave as I.", "पूरे नेटवर्क में कुल आने वाली धारा 10+1+2 = 13 A है, अतः बाहर जाने वाली I = 13 A।"), true),
  q("2-12", 6, pair("A capacitor is connected to a cell of emf E having internal resistance r. After steady state is reached, the potential difference across the:", "आंतरिक प्रतिरोध r वाले विद्युत वाहक बल E के सेल से संधारित्र जुड़ा है। स्थायी अवस्था में विभवांतर:"), options(pair("Cell is less than E", "सेल पर E से कम है"), pair("Cell is E", "सेल पर E है"), pair("Capacitor is greater than E", "संधारित्र पर E से अधिक है"), pair("Capacitor is less than E", "संधारित्र पर E से कम है")), 1, pair("At steady state the current is zero, so the internal voltage drop Ir is zero and terminal voltage equals E.", "स्थायी अवस्था में धारा शून्य है, इसलिए आंतरिक विभव-पतन Ir शून्य और टर्मिनल वोल्टेज E है।")),
  q("2-13", 7, pair("In a metre bridge, P = 3 Ω balances at 55 cm. When an unknown resistance x is added in series with P, balance occurs at 75 cm. The value of x is:", "मीटर ब्रिज में P = 3 Ω के लिए संतुलन लंबाई 55 cm है। P के साथ अज्ञात प्रतिरोध x श्रेणीक्रम में जोड़ने पर संतुलन 75 cm पर होता है। x है:"), options(pair("54/12 Ω", "54/12 Ω"), pair("20/11 Ω", "20/11 Ω"), pair("48/11 Ω", "48/11 Ω"), pair("11/48 Ω", "11/48 Ω"), pair("5 Ω", "5 Ω")), 2, pair("From P/Q = 55/45 and (P+x)/Q = 75/25, eliminating Q gives x = 48/11 Ω.", "P/Q = 55/45 तथा (P+x)/Q = 75/25 से Q हटाने पर x = 48/11 Ω।"), true),
  q("2-14", 7, pair("A voltmeter has resistance G and range V. The series resistance needed to convert it to range nV is:", "एक वोल्टमीटर का प्रतिरोध G और परास V है। उसे nV परास में बदलने के लिए आवश्यक श्रेणी प्रतिरोध है:"), options(pair("nG", "nG"), pair("(n−1)G", "(n−1)G"), pair("G/n", "G/n"), pair("G/(n−1)", "G/(n−1)")), 1, pair("The full-scale current is V/G. For total voltage nV, total resistance is nG, so added resistance is (n−1)G.", "पूर्ण-विचलन धारा V/G है। nV के लिए कुल प्रतिरोध nG, इसलिए जोड़ा गया प्रतिरोध (n−1)G।")),
  q("2-15", 8, pair("A current I flows through the loop shown. The magnetic field at the centre O is:", "चित्र के लूप में धारा I बहती है। केंद्र O पर चुंबकीय क्षेत्र है:"), options(pair("7μ₀I/(16R), into the page", "7μ₀I/(16R), पृष्ठ के अंदर"), pair("7μ₀I/(16R), out of the page", "7μ₀I/(16R), पृष्ठ के बाहर"), pair("5μ₀I/(16R), into the page", "5μ₀I/(16R), पृष्ठ के अंदर"), pair("5μ₀I/(16R), out of the page", "5μ₀I/(16R), पृष्ठ के बाहर")), 0, pair("Only the arcs contribute at O. The 3π/2 arc of radius R and π/2 arc of radius 2R add to 7μ₀I/(16R), into the page.", "O पर केवल वृत्तीय चाप योगदान देते हैं। R त्रिज्या के 3π/2 चाप और 2R त्रिज्या के π/2 चाप का योग 7μ₀I/(16R), पृष्ठ के अंदर है।"), true),
  q("2-16", 9, pair("A proton and a deuteron with the same kinetic energy enter perpendicularly into a uniform magnetic field. If their circular-path radii are Rp and Rd, then:", "समान गतिज ऊर्जा वाला प्रोटॉन और ड्यूटेरॉन समान चुंबकीय क्षेत्र में लंबवत प्रवेश करते हैं। उनकी वृत्तीय पथ त्रिज्याएँ Rp और Rd हों, तो:"), options(pair("Rd = √2 Rp", "Rd = √2 Rp"), pair("Rd = Rp/√2", "Rd = Rp/√2"), pair("Rd = Rp", "Rd = Rp"), pair("Rd = 2Rp", "Rd = 2Rp")), 0, pair("For equal charge and kinetic energy, r = √(2mK)/(qB) ∝ √m. A deuteron has twice the proton mass.", "समान आवेश और गतिज ऊर्जा के लिए r ∝ √m। ड्यूटेरॉन का द्रव्यमान प्रोटॉन से दोगुना है।")),
  q("2-17", 9, pair("A proton moving with velocity v is acted upon by electric field E and magnetic field B. It moves undeflected if:", "वेग v से चलता प्रोटॉन विद्युत क्षेत्र E और चुंबकीय क्षेत्र B में है। वह अविक्षेपित चलेगा यदि:"), options(pair("E is perpendicular to B", "E, B के लंबवत है"), pair("E is parallel to v and perpendicular to B", "E, v के समांतर तथा B के लंबवत है"), pair("E, B and v are mutually perpendicular and v = E/B", "E, B और v परस्पर लंबवत तथा v = E/B है"), pair("E and B are both parallel to v", "E और B दोनों v के समांतर हैं")), 2, pair("For zero net force, qE and qvB must oppose with equal magnitudes, requiring mutually perpendicular fields and v = E/B.", "कुल बल शून्य होने के लिए qE और qvB बराबर तथा विपरीत हों; अतः क्षेत्र परस्पर लंबवत और v = E/B।")),
  q("2-18", 10, pair("Three long parallel wires carry currents as shown. The force on 10 cm length of wire Q is:", "तीन लंबी समांतर तारों में चित्रानुसार धाराएँ हैं। तार Q की 10 cm लंबाई पर बल है:"), options(pair("1.4×10⁻⁴ N towards right", "1.4×10⁻⁴ N दाईं ओर"), pair("1.4×10⁻⁴ N towards left", "1.4×10⁻⁴ N बाईं ओर"), pair("2.6×10⁻⁴ N towards right", "2.6×10⁻⁴ N दाईं ओर"), pair("2.6×10⁻⁴ N towards left", "2.6×10⁻⁴ N बाईं ओर")), 0, pair("Both neighbouring currents oppose Q and repel it. The left and right forces are 2.0×10⁻⁴ N right and 0.6×10⁻⁴ N left, giving 1.4×10⁻⁴ N right.", "दोनों पड़ोसी धाराएँ Q के विपरीत हैं और उसे प्रतिकर्षित करती हैं। बलों का अंतर 1.4×10⁻⁴ N दाईं ओर है।"), true),
  q("2-19", 11, pair("Each bar magnet in configurations A-D has dipole moment m. Which configuration has the highest net magnetic dipole moment?", "A-D विन्यासों में प्रत्येक छड़ चुंबक का द्विध्रुव आघूर्ण m है। किस विन्यास का परिणामी चुंबकीय द्विध्रुव आघूर्ण सबसे अधिक है?"), options(pair("C", "C"), pair("D", "D"), pair("A", "A"), pair("B", "B")), 0, pair("The two dipole vectors in C make the smallest angle (30°), so their vector sum is the largest.", "C में दोनों द्विध्रुव सदिशों के बीच सबसे छोटा कोण 30° है, इसलिए उनका सदिश योग अधिकतम है।"), true),
  q("2-20", 12, pair("Four lowest energy levels of the hydrogen atom are shown. The number of possible emission lines is:", "हाइड्रोजन परमाणु के चार न्यूनतम ऊर्जा स्तर दिखाए गए हैं। संभव उत्सर्जन रेखाओं की संख्या है:"), options(pair("3", "3"), pair("4", "4"), pair("5", "5"), pair("6", "6")), 3, pair("For four levels, the number of downward transitions is n(n−1)/2 = 4×3/2 = 6.", "चार स्तरों के लिए नीचे की ओर संक्रमणों की संख्या n(n−1)/2 = 6 है।"), true),
  q("2-21", 13, pair("A radioactive isotope has half-life T. How long will its activity take to reduce to 1% of the original value?", "एक रेडियोधर्मी समस्थानिक की अर्ध-आयु T है। उसकी सक्रियता मूल मान की 1% होने में कितना समय लगेगा?"), options(pair("3.2T", "3.2T"), pair("4.6T", "4.6T"), pair("6.6T", "6.6T"), pair("9.2T", "9.2T")), 2, pair("(1/2)^(t/T) = 0.01 gives t/T = log₂100 ≈ 6.64.", "(1/2)^(t/T) = 0.01 से t/T = log₂100 ≈ 6.64।")),
  q("2-22", 13, pair("In the beta decay ₁₅P³² → ₁₆S³² + x + y, x and y are:", "बीटा क्षय ₁₅P³² → ₁₆S³² + x + y में x और y हैं:"), options(pair("Electron and neutrino", "इलेक्ट्रॉन और न्यूट्रिनो"), pair("Positron and neutrino", "पॉज़िट्रॉन और न्यूट्रिनो"), pair("Electron and antineutrino", "इलेक्ट्रॉन और प्रतिन्यूट्रिनो"), pair("Positron and antineutrino", "पॉज़िट्रॉन और प्रतिन्यूट्रिनो")), 2, pair("This is β⁻ decay: a neutron becomes a proton while emitting an electron and an electron antineutrino.", "यह β⁻ क्षय है: न्यूट्रॉन प्रोटॉन में बदलकर इलेक्ट्रॉन और इलेक्ट्रॉन प्रतिन्यूट्रिनो उत्सर्जित करता है।")),
  q("2-23", 13, pair("Equal initial amounts of radioactive samples X and Y remain as 1/256 and 1/16 respectively after 8 hours. The ratio of their half-lives TX:TY is:", "रेडियोधर्मी नमूने X और Y की समान प्रारंभिक मात्रा में से 8 घंटे बाद क्रमशः 1/256 और 1/16 बचती है। उनकी अर्ध-आयुओं TX:TY का अनुपात है:"), options(pair("2:1", "2:1"), pair("1:2", "1:2"), pair("1:4", "1:4"), pair("1:16", "1:16"), pair("4:1", "4:1")), 1, pair("X undergoes 8 half-lives and Y 4 half-lives in 8 hours, so TX = 1 h and TY = 2 h.", "8 घंटे में X की 8 और Y की 4 अर्ध-आयु होती हैं, इसलिए TX:TY = 1:2।")),
  q("2-24", 14, pair("For forward biasing of a PN junction, which figure correctly shows the direction of flow of majority carriers?", "PN जंक्शन के अग्र अभिनति में बहुसंख्यक वाहकों के प्रवाह की दिशा किस चित्र में सही है?"), options(pair("Figure A", "चित्र A"), pair("Figure B", "चित्र B"), pair("Figure C", "चित्र C"), pair("Figure D", "चित्र D")), 2, pair("In forward bias, holes move from P to N and electrons from N to P; this is shown in figure C.", "अग्र अभिनति में होल P से N और इलेक्ट्रॉन N से P की ओर चलते हैं; यह चित्र C में है।"), true),
  q("2-25", 15, pair("A disc of moment of inertia Iₜ rotates with angular speed ωᵢ. A stationary coaxial disc of moment of inertia Iᵦ is dropped on it, and both finally rotate together. The energy lost to friction is:", "जड़त्व आघूर्ण Iₜ की डिस्क ωᵢ से घूम रही है। जड़त्व आघूर्ण Iᵦ की स्थिर समाक्षीय डिस्क उस पर गिरती है और अंत में दोनों साथ घूमती हैं। घर्षण में नष्ट ऊर्जा है:"), options(pair("½[IᵦIₜ/(Iₜ+Iᵦ)]ωᵢ²", "½[IᵦIₜ/(Iₜ+Iᵦ)]ωᵢ²"), pair("½[Iᵦ²/(Iₜ+Iᵦ)]ωᵢ²", "½[Iᵦ²/(Iₜ+Iᵦ)]ωᵢ²"), pair("½[Iₜ²/(Iₜ+Iᵦ)]ωᵢ²", "½[Iₜ²/(Iₜ+Iᵦ)]ωᵢ²"), pair("[(Iᵦ−Iₜ)/(Iₜ+Iᵦ)]ωᵢ²", "[(Iᵦ−Iₜ)/(Iₜ+Iᵦ)]ωᵢ²")), 0, pair("Angular momentum conservation gives ωf = Iₜωᵢ/(Iₜ+Iᵦ). Subtracting final from initial kinetic energy gives option A.", "कोणीय संवेग संरक्षण से ωf = Iₜωᵢ/(Iₜ+Iᵦ)। अंतिम ऊर्जा को प्रारंभिक ऊर्जा से घटाने पर विकल्प A मिलता है।")),
  q("2-26", 16, pair("A solid disc rolls clockwise without slipping with speed v. The speeds of its top point A, side point B and contact point C relative to a stationary observer are respectively:", "एक ठोस डिस्क v चाल से बिना फिसले दक्षिणावर्त लुढ़कती है। स्थिर प्रेक्षक के सापेक्ष शीर्ष बिंदु A, पार्श्व बिंदु B और संपर्क बिंदु C की चालें क्रमशः हैं:"), options(pair("v, v and v", "v, v और v"), pair("2v, √2v and zero", "2v, √2v और शून्य"), pair("2v, 2v and zero", "2v, 2v और शून्य"), pair("2v, √2v and √2v", "2v, √2v और √2v")), 1, pair("Translational and rotational velocities add to 2v at the top, √2v at the side, and cancel at contact.", "स्थानांतरण और घूर्णन वेग शीर्ष पर जुड़कर 2v, पार्श्व पर √2v तथा संपर्क पर कटकर शून्य देते हैं।"), true),
  q("2-27", 17, pair("The excess pressure in a gas bubble of radius R inside a liquid of surface tension S is:", "पृष्ठ तनाव S वाले द्रव के भीतर R त्रिज्या के गैस बुलबुले में अतिरिक्त दाब है:"), options(pair("2R/S", "2R/S"), pair("2S/R", "2S/R"), pair("2R²/S", "2R²/S"), pair("2S/R²", "2S/R²")), 1, pair("A gas bubble in a liquid has one interface, so Laplace excess pressure is 2S/R.", "द्रव में गैस बुलबुले की एक सतह होती है, इसलिए लाप्लास अतिरिक्त दाब 2S/R है।")),
  q("2-28", 18, pair("A cubical block floats with half its volume immersed. If the whole system accelerates upward with acceleration g/3, the immersed fraction becomes:", "एक घनाकार खंड अपने आधे आयतन के साथ द्रव में तैरता है। पूरी प्रणाली g/3 त्वरण से ऊपर जाए, तो डूबा हुआ आयतन-अंश होगा:"), options(pair("1/2", "1/2"), pair("3/8", "3/8"), pair("2/3", "2/3"), pair("3/4", "3/4")), 0, pair("Both weight and buoyancy acquire the same effective acceleration factor, so the density ratio and immersed fraction remain 1/2.", "भार और उत्प्लावन दोनों में समान प्रभावी त्वरण गुणक आता है, इसलिए घनत्व अनुपात और डूबा अंश 1/2 ही रहता है।"), true),
  q("2-29", 19, pair("For gases A and B, TA/TB = MA/MB, where T is temperature and M molecular mass. If CA and CB are their rms speeds, CA/CB equals:", "गैसों A और B के लिए TA/TB = MA/MB है, जहाँ T ताप और M आणविक द्रव्यमान है। उनकी rms चालें CA और CB हों, तो CA/CB है:"), options(pair("2", "2"), pair("4", "4"), pair("1", "1"), pair("0.5", "0.5")), 2, pair("Crms ∝ √(T/M). The given equality makes TA/MA = TB/MB, so the rms speeds are equal.", "Crms ∝ √(T/M)। दिए संबंध से TA/MA = TB/MB, इसलिए rms चालें समान हैं।")),
  q("2-30", 19, pair("For a gas at temperature T, the correct relation among root-mean-square speed urms, average speed uav and most probable speed ump is:", "ताप T पर गैस के लिए वर्ग-माध्य-मूल चाल urms, औसत चाल uav और सर्वाधिक संभावित चाल ump का सही संबंध है:"), options(pair("urms > uav > ump", "urms > uav > ump"), pair("uav > urms > ump", "uav > urms > ump"), pair("ump > uav > urms", "ump > uav > urms"), pair("ump > urms > uav", "ump > urms > uav")), 0, pair("For a Maxwell distribution: urms = √(3RT/M), uav = √(8RT/πM), and ump = √(2RT/M).", "मैक्सवेल वितरण में urms = √(3RT/M), uav = √(8RT/πM), तथा ump = √(2RT/M), अतः यही क्रम है।")),
];

const exactQuestionText: Record<string, [string, string]> = {
  "2-01": pair(
    "The electrostatic potential inside a charged spherical ball is given by φ = ar² + b where r is the distance from the centre; a, b are constants. Then the charge density inside the ball is",
    "एक आवेशित गोलाकार पिंड के भीतर वैद्युत विभव φ = ar² + b द्वारा दिया गया है, जहाँ r केंद्र से दूरी है तथा a, b नियतांक हैं। तब पिंड के भीतर आवेश घनत्व है",
  ),
  "2-02": pair(
    "A charge Q is enclosed by a Gaussian spherical surface of radius R. If the radius is doubled, then the outward electric flux will",
    "त्रिज्या R के एक गाउसीय गोलाकार पृष्ठ द्वारा आवेश Q परिबद्ध है। यदि त्रिज्या दोगुनी कर दी जाए, तो बाहर की ओर विद्युत फ्लक्स",
  ),
  "2-03": pair(
    "What is the flux through a cube of side ‘a’ if a point charge of q is at one of its corner",
    "यदि ‘a’ भुजा वाले घन के किसी एक कोने पर q का बिंदु आवेश हो, तो घन से गुजरने वाला फ्लक्स कितना है",
  ),
  "2-04": pair(
    "The expression for the capacity of the capacitor formed by compound dielectric placed between the plates of a parallel plate capacitor as shown in figure, will be (area of plate = A)",
    "चित्रानुसार समांतर-पट्टिका संधारित्र की प्लेटों के बीच संयुक्त परावैद्युत रखने से बने संधारित्र की धारिता का व्यंजक होगा (प्लेट का क्षेत्रफल = A)",
  ),
  "2-05": pair(
    "The intensity of electric field at a point between the plates of a charged capacitor",
    "एक आवेशित संधारित्र की प्लेटों के बीच किसी बिंदु पर विद्युत क्षेत्र की तीव्रता",
  ),
  "2-06": pair(
    "A small sphere carrying a charge ‘q’ is hanging in between two parallel plates by a string of length L. Time period of pendulum is T₀. When parallel plates are charged, the time period changes to T. The ratio T/T₀ is equal to",
    "‘q’ आवेश धारण करने वाला एक छोटा गोला L लंबाई की डोरी द्वारा दो समांतर प्लेटों के बीच लटका है। लोलक का आवर्तकाल T₀ है। जब समांतर प्लेटों को आवेशित किया जाता है, तो आवर्तकाल बदलकर T हो जाता है। अनुपात T/T₀ बराबर है",
  ),
  "2-07": pair(
    "In the figure below, what is the potential difference between the points A and B and between B and C respectively in steady state",
    "नीचे दिए गए चित्र में स्थायी अवस्था में क्रमशः A और B बिंदुओं के बीच तथा B और C के बीच विभवांतर कितना है",
  ),
  "2-08": pair(
    "Consider the circuit shown in the figure. The current I₃ is equal to",
    "चित्र में दिखाए गए परिपथ पर विचार कीजिए। धारा I₃ बराबर है",
  ),
  "2-09": pair(
    "If VAB = 4 V in the given figure, then resistance X will be",
    "दिए गए चित्र में यदि VAB = 4 V है, तो प्रतिरोध X होगा",
  ),
  "2-10": pair(
    "In the circuit shown, the current through the 5 Ω resistor is",
    "दिखाए गए परिपथ में 5 Ω प्रतिरोध से गुजरने वाली धारा है",
  ),
  "2-11": pair(
    "The figure shows a network of currents. The magnitude of currents is shown here. The current I will be",
    "चित्र धाराओं का एक नेटवर्क दिखाता है। धाराओं के परिमाण यहाँ दिखाए गए हैं। धारा I होगी",
  ),
  "2-12": pair(
    "A capacitor is connected to a cell of emf E having some internal resistance r. The potential difference across the",
    "एक संधारित्र को विद्युत वाहक बल E तथा कुछ आंतरिक प्रतिरोध r वाले सेल से जोड़ा गया है। विभवांतर",
  ),
  "2-13": pair(
    "In a metre bridge experiment, resistances are connected as shown in figure. The balancing length l₁ is 55 cm. Now an unknown resistance x is connected in series with P and the new balancing length is found to be 75 cm. The value of x is",
    "मीटर ब्रिज प्रयोग में प्रतिरोधों को चित्रानुसार जोड़ा गया है। संतुलन लंबाई l₁, 55 cm है। अब एक अज्ञात प्रतिरोध x को P के साथ श्रेणीक्रम में जोड़ा जाता है और नई संतुलन लंबाई 75 cm पाई जाती है। x का मान है",
  ),
  "2-14": pair(
    "A voltmeter has a resistance of G ohm and range V volt. The value of resistance used in series to convert it into a voltmeter of range nV volt is",
    "एक वोल्टमीटर का प्रतिरोध G ओम और परास V वोल्ट है। उसे nV वोल्ट परास के वोल्टमीटर में बदलने के लिए श्रेणीक्रम में प्रयुक्त प्रतिरोध का मान है",
  ),
  "2-15": pair(
    "A current I flowing through the loop as shown in figure. The magnetic field at centre O is",
    "चित्रानुसार लूप से धारा I बह रही है। केंद्र O पर चुंबकीय क्षेत्र है",
  ),
  "2-16": pair(
    "A proton and a deutron both having the same kinetic energy, enter perpendicularly into a uniform magnetic field B. For motion of proton and deutron on circular path of radius Rp and Rd respectively, the correct statement is",
    "समान गतिज ऊर्जा वाले एक प्रोटॉन और एक ड्यूट्रॉन एकसमान चुंबकीय क्षेत्र B में लंबवत प्रवेश करते हैं। क्रमशः Rp और Rd त्रिज्या के वृत्तीय पथ पर प्रोटॉन और ड्यूट्रॉन की गति के लिए सही कथन है",
  ),
  "2-17": pair(
    "A proton (or charged particle) moving with velocity v is acted upon by electric field E and magnetic field B. The proton will move undeflected if",
    "वेग v से गतिमान प्रोटॉन (या आवेशित कण) पर विद्युत क्षेत्र E और चुंबकीय क्षेत्र B कार्य करते हैं। प्रोटॉन बिना विचलित हुए चलेगा यदि",
  ),
  "2-18": pair(
    "Three long, straight and parallel wires carrying currents are arranged as shown in figure. The force experienced by 10 cm length of wire Q is",
    "धारा ले जाने वाली तीन लंबी, सीधी और समांतर तारों को चित्रानुसार व्यवस्थित किया गया है। तार Q की 10 cm लंबाई द्वारा अनुभव किया गया बल है",
  ),
  "2-19": pair(
    "Following figures show the arrangement of bar magnets in different configurations. Each magnet has magnetic dipole moment m. Which configuration has highest net magnetic dipole moment",
    "निम्न चित्र विभिन्न विन्यासों में छड़ चुंबकों की व्यवस्था दिखाते हैं। प्रत्येक चुंबक का चुंबकीय द्विध्रुव आघूर्ण m है। किस विन्यास का शुद्ध चुंबकीय द्विध्रुव आघूर्ण सर्वाधिक है",
  ),
  "2-20": pair(
    "Four lowest energy levels of H-atom are shown in the figure. The number of possible emission lines would be",
    "H-परमाणु के चार न्यूनतम ऊर्जा स्तर चित्र में दिखाए गए हैं। संभावित उत्सर्जन रेखाओं की संख्या होगी",
  ),
  "2-21": pair(
    "A radioactive isotope has a half life of T years. How long will it take the activity to reduce to 1% of its original value",
    "एक रेडियोधर्मी समस्थानिक की अर्ध-आयु T वर्ष है। उसकी सक्रियता को उसके मूल मान के 1% तक घटने में कितना समय लगेगा",
  ),
  "2-22": pair(
    "A common example of β decay is ₁₅P³² → ₁₆S³² + x + y. Then x and y stand for",
    "β क्षय का एक सामान्य उदाहरण ₁₅P³² → ₁₆S³² + x + y है। तब x और y हैं",
  ),
  "2-23": pair(
    "Two samples X and Y contain equal amount of radioactive substances. If 1/256th of the sample X and 1/16th of the sample Y, remain after 8 hours, then the ratio of half periods of X and Y is",
    "दो नमूनों X और Y में रेडियोधर्मी पदार्थों की समान मात्रा है। यदि 8 घंटे बाद नमूना X का 1/256वाँ और नमूना Y का 1/16वाँ भाग शेष रहता है, तो X और Y की अर्ध-आयुओं का अनुपात है",
  ),
  "2-24": pair(
    "In the case of forward biasing of PN-junction, which one of the following figures correctly depicts the direction of flow of carriers",
    "PN-जंक्शन के अग्र अभिनति की स्थिति में, निम्नलिखित में से कौन-सा चित्र वाहकों के प्रवाह की दिशा को सही रूप से दर्शाता है",
  ),
  "2-25": pair(
    "A circular disk of moment of inertia Iₜ is rotating in a horizontal plane, about its symmetry axis, with a constant angular speed ωᵢ. Another disk of moment of inertia Iᵦ is dropped coaxially onto the rotating disk. Initially the second disk has zero angular speed. Eventually both the disks rotate with a constant angular speed ωf. The energy lost by the initially rotating disc to friction is",
    "जड़त्व आघूर्ण Iₜ की एक वृत्ताकार डिस्क अपने सममिति अक्ष के परितः क्षैतिज तल में नियत कोणीय चाल ωᵢ से घूम रही है। जड़त्व आघूर्ण Iᵦ की दूसरी डिस्क को घूमती डिस्क पर समाक्षीय रूप से गिराया जाता है। प्रारंभ में दूसरी डिस्क की कोणीय चाल शून्य है। अंततः दोनों डिस्क नियत कोणीय चाल ωf से घूमती हैं। प्रारंभ में घूम रही डिस्क द्वारा घर्षण में खोई गई ऊर्जा है",
  ),
  "2-26": pair(
    "A solid disc rolls clockwise without slipping over a horizontal path with a constant speed v. Then the magnitude of the velocities of points A, B and C (see figure) with respect to a standing observer are respectively",
    "एक ठोस डिस्क नियत चाल v से क्षैतिज पथ पर बिना फिसले दक्षिणावर्त लुढ़कती है। तब स्थिर प्रेक्षक के सापेक्ष बिंदुओं A, B और C (चित्र देखें) के वेगों के परिमाण क्रमशः हैं",
  ),
  "2-27": pair(
    "The excess pressure in a bubble of radius R of a gas in a liquid of surface tension S is",
    "पृष्ठ तनाव S वाले द्रव में गैस के R त्रिज्या वाले बुलबुले में अतिरिक्त दाब है",
  ),
  "2-28": pair(
    "A cubical block is floating in a liquid with half of its volume immersed in the liquid. When the whole system accelerates upwards with acceleration of g/3, the fraction of volume immersed in the liquid will be",
    "एक घनाकार खंड द्रव में तैर रहा है और उसका आधा आयतन द्रव में डूबा है। जब पूरी प्रणाली g/3 त्वरण से ऊपर की ओर त्वरित होती है, तो द्रव में डूबे आयतन का अंश होगा",
  ),
  "2-29": pair(
    "Let A and B the two gases and given: TA/TB = MA/MB where T is the temperature and M is molecular mass. If CA and CB are the r.m.s. speed, then the ratio CA/CB will be equal to",
    "मान लीजिए A और B दो गैसें हैं तथा दिया है: TA/TB = MA/MB, जहाँ T तापमान और M आणविक द्रव्यमान है। यदि CA और CB वर्ग-माध्य-मूल चालें हैं, तो अनुपात CA/CB बराबर होगा",
  ),
  "2-30": pair(
    "For a gas at a temperature T the root-mean-square velocity urms, the most probable speed ump and the average speed uav obey the relationship",
    "तापमान T पर किसी गैस के लिए वर्ग-माध्य-मूल वेग urms, सर्वाधिक संभावित चाल ump और औसत चाल uav निम्न संबंध का पालन करते हैं",
  ),
};

const exactOptions: Partial<Record<string, Array<[string, string]>>> = {
  "2-02": options(pair("Be doubled", "दोगुना हो जाएगा"), pair("Increase four times", "चार गुना बढ़ जाएगा"), pair("Be reduced to half", "घटकर आधा हो जाएगा"), pair("Remain the same", "समान बना रहेगा")),
  "2-04": options(pair("ε₀A/(d₁/K₁ + d₂/K₂ + d₃/K₃)", "ε₀A/(d₁/K₁ + d₂/K₂ + d₃/K₃)"), pair("ε₀A/[(d₁ + d₂ + d₃)/(K₁ + K₂ + K₃)]", "ε₀A/[(d₁ + d₂ + d₃)/(K₁ + K₂ + K₃)]"), pair("ε₀A(K₁K₂K₃)/(d₁d₂d₃)", "ε₀A(K₁K₂K₃)/(d₁d₂d₃)"), pair("ε₀(AK₁/d₁ + AK₂/d₂ + AK₃/d₃)", "ε₀(AK₁/d₁ + AK₂/d₂ + AK₃/d₃)")),
  "2-05": options(pair("Is directly proportional to the distance between the plates", "प्लेटों के बीच की दूरी के समानुपाती है"), pair("Is inversely proportional to the distance between the plates", "प्लेटों के बीच की दूरी के व्युत्क्रमानुपाती है"), pair("Is inversely proportional to the square of the distance between the plates", "प्लेटों के बीच की दूरी के वर्ग के व्युत्क्रमानुपाती है"), pair("Does not depend upon the distance between the plates", "प्लेटों के बीच की दूरी पर निर्भर नहीं करती")),
  "2-07": options(pair("VAB = VBC = 100 V", "VAB = VBC = 100 V"), pair("VAB = 75 V, VBC = 25 V", "VAB = 75 V, VBC = 25 V"), pair("VAB = 25 V, VBC = 75 V", "VAB = 25 V, VBC = 75 V"), pair("VAB = VBC = 50 V", "VAB = VBC = 50 V")),
  "2-08": options(pair("5 amp", "5 एम्पियर"), pair("3 amp", "3 एम्पियर"), pair("−3 amp", "−3 एम्पियर"), pair("−5/6 amp", "−5/6 एम्पियर")),
  "2-12": options(pair("Cell is < E", "सेल पर विभवांतर E से कम है"), pair("Cell is E", "सेल पर विभवांतर E है"), pair("Capacitor is > E", "संधारित्र पर विभवांतर E से अधिक है"), pair("Capacitor is < E", "संधारित्र पर विभवांतर E से कम है")),
  "2-15": options(pair("7μ₀I/(16R) ⊗", "7μ₀I/(16R), पृष्ठ के भीतर ⊗"), pair("7μ₀I/(16R) ⊙", "7μ₀I/(16R), पृष्ठ के बाहर ⊙"), pair("5μ₀I/(16R) ⊗", "5μ₀I/(16R), पृष्ठ के भीतर ⊗"), pair("5μ₀I/(16R) ⊙", "5μ₀I/(16R), पृष्ठ के बाहर ⊙")),
  "2-18": options(pair("1.4×10⁻⁴ N towards right", "1.4×10⁻⁴ N दाईं ओर"), pair("1.4×10⁻⁴ N towards left", "1.4×10⁻⁴ N बाईं ओर"), pair("2.6×10⁻⁴ N to the right", "2.6×10⁻⁴ N दाईं ओर"), pair("2.6×10⁻⁴ N to the left", "2.6×10⁻⁴ N बाईं ओर")),
  "2-21": options(pair("3.2 T year", "3.2 T वर्ष"), pair("4.6 T year", "4.6 T वर्ष"), pair("6.6 T year", "6.6 T वर्ष"), pair("9.2 T year", "9.2 T वर्ष")),
};

const exactCorrectOptions: Partial<Record<string, number>> = {
  "2-04": 0,
};

export const bpscTre4Test2Questions: BpscTre4OnlineQuestion[] = test2Questions.map((question) => ({
  ...question,
  question: exactQuestionText[question.id] ?? question.question,
  options: exactOptions[question.id] ?? question.options,
  correctOption: exactCorrectOptions[question.id] ?? question.correctOption,
}));
