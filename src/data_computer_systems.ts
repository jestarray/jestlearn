import { ProblemSet, Problem } from "./ProblemSet";

/// inclusive range
export function ran_int(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//deci to binary
//tdo! change name as it just normalizes a deci number to bianry given a bit width
export function normalize_bwidth(num, width) {
  // zero shift right converts the number to a signed 32 bit number?
  let binary = (num >>> 0).toString(2);
  if (binary.length < width) {
    //pad with 0s
    return binary.padStart(width, "0");
  } else if (binary.length > width) {
    return binary.slice(-width);
  } else if (binary.length == width) {
    return binary;
  } else {
    console.warn(
      "WARNING! CHECK TO MAKE SURE THE BIT-WIDTH FITS WITHIN NUM RANGE"
    );
    return binary;
  }
}

// binary to twos complement decimal
// 1010 -> -6
export function twos_complement_deci(binary, width) {
  let sign_weight = -Math.pow(2, width - 1);
  let posi = normalize_bwidth(parseInt(binary, 2), width - 1);
  return sign_weight + parseInt(posi, 2);
}
export function generate_twoscomp_to_deci() {
  /*  let width_options = [4, 8];
     let ran_choice = ran_int(0, width_options.length - 1);
     let bit_width = width_options[ran_choice]; */
  let bit_width = ran_int(4, 8);

  let num = ran_int(0, -(Math.pow(2, bit_width) / 2 - 1));

  let binary = normalize_bwidth(num, bit_width);
  let signed_deci = twos_complement_deci(binary, bit_width);
  let unsigned_deci = parseInt(binary, 2);
  return new Problem(
    "input",
    `<h2>Given a bit-width of ${bit_width}, convert ${subscript(
      binary,
      2
    )} , to both signed and unsigned decimal</h2>`,
    `${signed_deci},${unsigned_deci}`,
    "<i>answer should be in form signed,unsigned e.g: -30,24</i>"
  );
}

export function subscript(string, base) {
  return `${string}<sub>${base}</sub>`;
}

export function generate_decimal_to_twoscomp() {
  let bit_width = ran_int(4, 8);
  let INMAX = -Math.pow(2, bit_width) / 2 - 1;

  // reminder! you did account for the max signed negative value!
  let num = ran_int(0, INMAX);

  let binary = normalize_bwidth(num, bit_width);
  return new Problem(
    "input",
    `<h2>Given a bit-width of ${bit_width}, convert the decimal number ${num} to two's complement binary</h2>`,
    binary,
    "answer hint: input must be the same length as the bit-width (pre-pad with 0s or 1s)"
  );
}

export function generate_hex_to_binary() {
  let ran = ran_int(0, Math.pow(2, 24));
  let binary = normalize_bwidth(ran, 0);
  let hex = ran.toString(16);
  return new Problem(
    "input",
    `<h2>Convert ${subscript(hex, 16)} to binary?</h2>`,
    binary,
    "Answer ex: 01010"
  );
}

export function generate_binary_to_hex() {
  let ran = ran_int(0, Math.pow(2, 24));
  let binary = normalize_bwidth(ran, 0);
  let hex = ran.toString(16);
  return new Problem(
    "input",
    `<h2>Convert ${subscript(binary, 2)} to hex?</h2>`,
    "0x" + hex,
    "prefix with '0x', example: 0xbfa11"
  );
}

export function generate_decimal_to_hex() {
  let ran = ran_int(0, 255);
  let hex = ran.toString(16);
  return new Problem(
    "input",
    `<h2>Convert ${subscript(ran, 10)} to hex?</h2>`,
    "0x" + hex,
    "prefix with '0x', example: 0xbfa1"
  );
}

export function generate_hex_to_decimal() {
  let ran = ran_int(0, 255);
  let hex = ran.toString(16);
  return new Problem(
    "input",
    `<h2>Convert ${subscript(hex, 16)} to decimal?</h2>`,
    ran,
    "Answer ex: 3"
  );
}

export function generate_decimal_to_binary() {
  let num = ran_int(0, 255);
  return new Problem(
    "input",
    `<h2>Convert ${subscript(num, 10)} to binary?(8 bits)</h2>`,
    normalize_bwidth(num, 8),
    "make sure answer is 8 bits e.g: 00010110"
  );
}

export function generate_binary_to_decimal() {
  let num = ran_int(0, 255);
  let binary = normalize_bwidth(num, 8);
  return new Problem(
    "input",
    `<h2>Convert ${subscript(binary, 2)} to decimal?</h2>`,
    parseInt(binary, 2).toString(),
    "Answer ex: 3"
  );
}

export function generate_bitwise_vec_operations() {
  let a = ran_int(0, 255) >>> 0;
  let b = ran_int(0, 255) >>> 0;
  let binary_a = normalize_bwidth(a, 8);
  let binary_b = normalize_bwidth(b, 8);
  let random_index = ran_int(0, 2);
  let ops = ["|", "&", "^"];
  let answer;
  let random_operation = ops[random_index];
  if (random_operation === "|") {
    answer = a | b;
  } else if (random_operation === "&") {
    answer = a & b;
  } else if (random_operation === "^") {
    answer = a ^ b;
  }

  return new Problem(
    "input",
    `
        <h2>Given</h2>
        <pre>
        a = ${binary_a}
        b = ${binary_b}
        </pre>
        <h2>what is a ${random_operation} b ?</h2>
        `,
    normalize_bwidth(answer, 8),
    "Answer ex: 000100"
  );
}

export function generate_bitwise_shift() {
  let a = ran_int(0, 255) >>> 0;
  let shift_amount = ran_int(1, 6);
  let hexed = a.toString(16);
  let binary_a = normalize_bwidth(a, 8);
  let ops = ["<<", ">>", ">>>"]; //left shift, logical right, arithmetic right
  let random_index = ran_int(0, ops.length - 1);
  let answer;
  if (ops[random_index] === "<<") {
    answer = binary_a.substring(shift_amount).padEnd(binary_a.length, "0");
  } else if (ops[random_index] == ">>>") {
    //arithmetic on signed
    let fill = "0";
    if (binary_a.substring(0, 1) == "1") {
      fill = "1";
    }
    answer = binary_a
      .substring(0, binary_a.length - shift_amount)
      .padStart(binary_a.length, fill);
  } else {
    // >> , logical no fill

    answer = binary_a
      .substring(0, binary_a.length - shift_amount)
      .padStart(binary_a.length, "0");
  }
  return new Problem(
    "input",
    `
        <h2>What is ${hexed}<sub>16</sub> ${ops[random_index]} ${shift_amount} in binary?</h2>
        `,
    answer,
    "Answer ex: 000100"
  );
}

function binary_add(s1, s2) {
  if (s1.length === s2.length) {
    let carry = 0;
    let res = "";
    for (let i = s1.length - 1; i >= 0; i--) {
      let a = s1[i];
      let b = s2[i];
      if (a === "1" && b === "1" && carry === 1) {
        carry = 1;
        res += "1";
      } else if (a === "1" && b === "1" && carry === 0) {
        carry = 1;
        res += "0";
      } else if ((a === "1" || b === "1") && carry === 1) {
        res += "0";
        carry = 1;
      } else if ((a === "1" || b === "1") && carry === 0) {
        res += "1";
        carry = 0;
      } else if (carry == 1) {
        carry = 0;
        res += "1";
      } else {
        res += "0";
        carry = 0;
      }
    }
    return res.split("").reverse().join("");
  } else {
    console.warn("inputs need to be the same length");
  }
}

let binary_num_resources = [
  {
    url_title: "article",
    url: "https://computers404.netlify.app/06-binarynumbers",
    additional: "",
  },
  { url_title: "video", url: "https://youtu.be/bFLB4dyNKUk", additional: "" },
];

export let all = [
  new ProblemSet(
    "Binary To Decimal",
    0.0,
    5,
    [],
    generate_binary_to_decimal,
    [],
    binary_num_resources
  ),
  new ProblemSet(
    "Decimal To Binary",
    0.1,
    5,
    [],
    generate_decimal_to_binary,
    [],
    binary_num_resources
  ),
  new ProblemSet("Binary to Hex", 2.1, 5, [], generate_binary_to_hex),
  new ProblemSet("Hex to Binary", 2.1, 5, [], generate_hex_to_binary),
  new ProblemSet("Decimal to Hex", 2.3, 5, [], generate_decimal_to_hex),
  new ProblemSet("Hex to Decimal", 2.3, 5, [], generate_hex_to_decimal),
  new ProblemSet(
    "Bitwise Operations",
    2.8,
    5,
    [],
    generate_bitwise_vec_operations
  ),
  new ProblemSet(
    "Bitshifting (arithmetic and logical)",
    2.16,
    20,
    [],
    generate_bitwise_shift
  ),
  new ProblemSet(
    "Binary Addition(unsigned)",
    2.17,
    10,
    [],
    function gen_binary_addtion_unsigned() {
      let bit_width = ran_int(4, 8);
      let UMAX = Math.pow(2, bit_width) - 1;

      let n1 = ran_int(1, UMAX);
      let n2 = ran_int(1, UMAX);

      let b1 = normalize_bwidth(n1, bit_width);
      let b2 = normalize_bwidth(n2, bit_width);
      let normal_add = n1 + n2;
      let answer;
      if (normal_add > UMAX) {
        //overflow, so there are two answers because of wrap around...
        // problem is which input  comes first..
        let overflow = normal_add - Math.pow(2, bit_width);
        answer = `${normal_add},${overflow}`;
      } else {
        answer = normal_add.toString();
      }

      return new Problem(
        "input",
        `
            <h2>Given a bit width of ${bit_width}</h2>
            <pre>
              ${b1}
            + ${b2}
            _______
            </pre>
            Convert the answer to decimal`,
        `${answer}`,
        "If there are two answers, write the one with the highest number first comma second answer e.g 10,3"
      );
    },
    [],
    [
      {
        url_title: "article",
        url: "https://computers404.netlify.app/07-binary_addition",
        additional: "",
      },
      {
        url_title: "video",
        url: "https://youtu.be/_XEl45i8YqM",
        additional: "",
      },
    ]
  ),
  new ProblemSet(
    "Decimal to Binary(two's complement)",
    2.17,
    10,
    [],
    generate_decimal_to_twoscomp,
    [],
    [
      {
        url_title: "article",
        url: "https://computers404.ml/07-negative_numbers_twos_complement",
        additional: "",
      },
      { url_title: "video", url: "https://youtu.be/Q32TDUTGfQM", additional: "" },
    ]
  ),
  new ProblemSet(
    "Binary to Decimal(unsigned and signed twos compl)",
    2.19,
    10,
    [],
    generate_twoscomp_to_deci,
    [],
    [
      {
        url_title: "article",
        url: "https://computers404.ml/07-negative_numbers_twos_complement",
        additional: "",
      },
      { url_title: "video", url: "https://youtu.be/Q32TDUTGfQM", additional: "" },
    ]
  ),
  new ProblemSet(
    "Binary Subtraction(two's complement)",
    2.19,
    10,
    [],
    function gen_sub_problem() {
      //twos complement only! no need to do unsigned + signed
      let bit_width = ran_int(4, 8);
      let TMIN = -(Math.pow(2, bit_width) / 2 - 1);
      let TMAX = Math.pow(2, bit_width) / 2;

      //decimal
      let d1 = ran_int(-1, TMIN);
      let d2 = ran_int(1, TMAX);

      let b1 = normalize_bwidth(d1, bit_width);
      let b2 = normalize_bwidth(d2, bit_width);

      let answer = d1 + d2;

      return new Problem(
        "input",
        `
            <h2>Given a bit width of ${bit_width}, Subtract these two signed numbers and write the equiv equation in decimal</h2>
            <pre>
              ${b1}
            + ${b2}
            _______
            </pre>
            Write the equivalent equation in decimal`,
        `${d1}+${d2}=${answer}`,
        "answer hint: -3+4=1"
      );
    }
  ),
  new ProblemSet(
    "Signed Overflow",
    2.29,
    10,
    [],
    function gen_signed_overflow_prob() {
      //twos complement only! no need to do unsigned + signed
      let bit_width = ran_int(4, 8);
      //this will never overflow! maybe do a seperate exercise about overflow
      let TMIN = -(Math.pow(2, bit_width) / 2);
      let TMAX = Math.pow(2, bit_width) / 2 - 1;
      //decimal
      let d1;
      let d2;
      let b1;
      let b2;
      let ran_choice = ran_int(1, 2);
      let answer;
      if (ran_choice === 1) {
        //negative overflow
        d1 = ran_int(-1, TMIN);
        d2 = ran_int(-1, TMIN);
        while (d1 + d2 > TMIN) {
          d2 = ran_int(-1, TMIN);
        }
        b1 = normalize_bwidth(d1, bit_width);
        b2 = normalize_bwidth(d2, bit_width);
        answer = parseInt(binary_add(b1, b2), 2);
      } else {
        //positive overflow
        d1 = ran_int(1, TMAX);
        d2 = ran_int(1, TMAX);
        while (d1 + d2 <= TMAX) {
          d2 = ran_int(1, TMAX);
        }
        b1 = normalize_bwidth(d1, bit_width);
        b2 = normalize_bwidth(d2, bit_width);
        let badd = binary_add(b1, b2);
        answer = twos_complement_deci(badd, bit_width);
      }
      return new Problem(
        "input",
        `
            <h2>Given a bit width of ${bit_width}, Write the equivalent equation in decimal</h2>
            <pre>
              ${b1}
            + ${b2}
            _______
            </pre>
            both numbers are signed`,
        `${d1}+${d2}=${answer}`,
        "answer hint: -3+4=1"
      );
    }
  ),
];

//WARNING: do not stringify this! we need the gen function and a copy of the original questions for resetting and other things
export const TOC_original: ProblemSet[] = all.map((val) => Object.freeze(val));

// we are mutating this
//copy over the gen() functions that got removed because of stringify
export let TOC: ProblemSet[] = JSON.parse(JSON.stringify(all)).map(
  (val, index) => {
    let m1 = Object.assign(val, TOC_original[index]);
    //so we can run has_started() since it deleted the prototype link to the clas :/
    m1.__proto__ = ProblemSet.prototype;
    return m1;
  }
);
//window.toc = TOC;
//the home page of your course will be at https://yourdomain.com/example_course , where example_course is the name of the course(all spaces are replaced by underscores) to avoid making a get req to the server
export const COURSE_NAME = "computer systems";
