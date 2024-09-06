export function calculateStatistics(data) {
    const ranges = {
        'under3.5': { count: 0, percentage: 0 },
        '3.5to4.99': { count: 0, percentage: 0 },
        '5to6.49': { count: 0, percentage: 0 },
        '6.5to7.99': { count: 0, percentage: 0 },
        '8andAbove': { count: 0, percentage: 0 }
    };

    // Tính tổng số học sinh
    const totalCount = data.length;

    // Đếm số lượng học sinh trong từng khoảng điểm
    data.forEach(item => {
        const avg = item.avgEntire ?? item.avg;
        if (avg < 3.5) {
            ranges['under3.5'].count++;
        } else if (avg >= 3.5 && avg < 5) {
            ranges['3.5to4.99'].count++;
        } else if (avg >= 5 && avg < 6.5) {
            ranges['5to6.49'].count++;
        } else if (avg >= 6.5 && avg < 8) {
            ranges['6.5to7.99'].count++;
        } else if (avg >= 8) {
            ranges['8andAbove'].count++;
        }
    });

    // Tính tỷ lệ phần trăm
    for (const range in ranges) {
        ranges[range].percentage = (+(ranges[range].count / totalCount * 100).toFixed(2));
    }

    return ranges;
}