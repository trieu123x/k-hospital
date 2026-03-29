# CÁCH THỰC THI:

1. Lập lịch chạy liên tục theo chu kỳ ngày/tuân/tháng 
    ```bash
    node src/index.js --schedule
    ```

2. Lập lịch chạy 1 lần duy nhất vào 1 thời điểm cụ thể
    ```bash
    node src/index.js --test <daily> <YYYY-MM-DD>
    ```
    Ví dụ: 
    ```bash
    node src/index.js --test daily 2026-03-24
    ```