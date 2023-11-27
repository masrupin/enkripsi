function encrypt() {
    const selectedCipher = document.getElementById('cipher').value;
    const text = document.getElementById('text').value.toLowerCase().replace(/[^a-z]/g, '');
    const key = document.getElementById('key').value.toLowerCase().replace(/[^a-z]/g, '');
  
    let result = '';
  
    switch (selectedCipher) {
      case 'vigenere':
        result = vigenereCipher(text, key);
        break;
      case 'playfair':
        result = playfairCipher(text, key);
        break;
      default:
        result = 'Pilih cipher yang valid.';
    }
  
    document.getElementById('result').value = result;
  }
  
  
  function vigenereCipher(text, key) {
    let encryptedText = '';
    const keyLength = key.length;
    let keyIndex = 0;
  
    for (let i = 0; i < text.length; i++) {
      let charCode = text.charCodeAt(i);
      if (charCode >= 97 && charCode <= 122) { // lowercase letters
        const keyChar = key.charCodeAt(keyIndex) - 97;
        const shift = (charCode - 97 + keyChar) % 26;
        encryptedText += String.fromCharCode(shift + 97);
        keyIndex = (keyIndex + 1) % keyLength;
      }
    }
  
    return encryptedText;
  }
  
  function playfairCipher(text, key) {
    const sanitizedText = text.replace(/[^a-z]/g, '').replace(/j/g, 'i'); // Hapus karakter yang bukan huruf dan ganti 'j' dengan 'i'
    const sanitizedKey = key.replace(/[^a-z]/g, '').replace(/j/g, 'i'); // Hapus karakter yang bukan huruf dan ganti 'j' dengan 'i'
  
    const matrix = generateMatrix(sanitizedKey);
  
    let encryptedText = '';
    for (let i = 0; i < sanitizedText.length; i += 2) {
      const pair = sanitizedText.substr(i, 2);
      if (pair.length === 1) {
        encryptedText += encryptPair(pair.charAt(0), 'x', matrix);
      } else {
        encryptedText += encryptPair(pair.charAt(0), pair.charAt(1), matrix);
      }
    }
  
    return encryptedText;
  }
  
  function generateMatrix(key) {
    const alphabet = 'abcdefghiklmnopqrstuvwxyz'; // Menghilangkan 'j'
    const matrix = [];
  
    for (let i = 0; i < key.length; i++) {
      if (!matrix.includes(key.charAt(i))) {
        matrix.push(key.charAt(i));
      }
    }
  
    for (let i = 0; i < alphabet.length; i++) {
      if (!matrix.includes(alphabet.charAt(i))) {
        matrix.push(alphabet.charAt(i));
      }
    }
  
    // Membuat matriks 5x5
    const matrixArray = [];
    for (let i = 0; i < 5; i++) {
      matrixArray.push(matrix.slice(i * 5, (i + 1) * 5));
    }
  
    return matrixArray;
  }
  
  function encryptPair(a, b, matrix) {
    let aRow, aCol, bRow, bCol;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (matrix[i][j] === a) {
          aRow = i;
          aCol = j;
        } else if (matrix[i][j] === b) {
          bRow = i;
          bCol = j;
        }
      }
    }
  
    let encryptedPair = '';
    if (aRow === bRow) {
      encryptedPair += matrix[aRow][(aCol + 1) % 5];
      encryptedPair += matrix[bRow][(bCol + 1) % 5];
    } else if (aCol === bCol) {
      encryptedPair += matrix[(aRow + 1) % 5][aCol];
      encryptedPair += matrix[(bRow + 1) % 5][bCol];
    } else {
      encryptedPair += matrix[aRow][bCol];
      encryptedPair += matrix[bRow][aCol];
    }
  
    return encryptedPair;
  }
  
  function copyText() {
    const outputTextArea = document.getElementById('result');
    const textToCopy = outputTextArea.value.trim(); // Mendapatkan teks dari textarea dan menghapus spasi di awal dan akhir
  
    if (textToCopy) { // Jika ada teks di textarea
      outputTextArea.select();
      outputTextArea.setSelectionRange(0, 99999);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
  
      const alertBox = document.createElement('div');
      alertBox.classList.add('alert');
      alertBox.textContent = 'Teks berhasil disalin ke clipboard!';
  
      document.body.appendChild(alertBox);
  
      alertBox.style.display = 'block'; // Menampilkan alert
  
      setTimeout(function() {
        alertBox.style.display = 'none'; // Menghilangkan alert setelah 3 detik
      }, 3000); // Waktu (dalam milidetik) sebelum alert ditutup secara otomatis (misalnya 3000 untuk 3 detik)
    }
  }
  
  
  