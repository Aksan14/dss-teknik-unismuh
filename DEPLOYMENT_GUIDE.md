# PANDUAN IMPLEMENTASI & DEPLOYMENT

## 📋 Daftar Checklist Implementasi

### Phase 1: Verifikasi & Testing (Selesai ✅)
- [x] Tambahkan 6 pertanyaan baru ke analisis mahasiswa
- [x] Implementasi logic dan scoring system
- [x] Buat penjelasan detail untuk setiap pertanyaan
- [x] Update UI untuk menampilkan 13 pertanyaan
- [x] Create comprehensive documentation

### Phase 2: Testing & QA (To Do)
- [ ] Unit testing untuk setiap pertanyaan
- [ ] Integration testing dengan backend
- [ ] User acceptance testing (UAT) dengan dekan
- [ ] Load testing untuk performa
- [ ] Cross-browser compatibility testing
- [ ] Mobile responsiveness testing

### Phase 3: Deployment (To Do)
- [ ] Backup database
- [ ] Deploy ke staging environment
- [ ] Final review dan approval
- [ ] Deploy ke production
- [ ] Monitor dan troubleshoot

### Phase 4: Post-Launch (To Do)
- [ ] Gather user feedback
- [ ] Monitor usage analytics
- [ ] Fix bugs dan optimize performance
- [ ] Plan untuk improvement berikutnya

---

## 🔍 Testing Scenarios

### Test Case #1: Mahasiswa Berprestasi (PASS)
**Scenario**: Ahmad Fauzi Rahman (NIM: 105841100420)
```
Expected Output:
- Q1: Contact info ✅
- Q2: 52 MK Lulus ✅
- Q3: 132 SKS / 144 (91%) ✅
- Q4: 12 SKS belum lulus ✅
- Q5: IPK 3.75 (Cumlaude) ✅
- Q6: 12 semester sisa ✅
- Q7: Lulus 1 tahun lagi ✅
- Q8: 95% kehadiran (Baik) ✅
- Q9: 0 MK mengulang (Sempurna) ✅
- Q10: Penerima Beasiswa + 2 Prestasi ✅
- Q11: Dosen PA info ✅
- Q12: Status TA: SIAP ✅
- Q13: Risk Score 0/20 (Rendah) ✅

Semua status harus menampilkan STATUS BAIK (🟢) atau INFO (ℹ️)
```

### Test Case #2: Mahasiswa Berisiko (WARN)
**Scenario**: Hipotesis - Mahasiswa dengan kondisi sulit
```
Data Simulasi:
- IPK: 1.8 (Di bawah minimum 2.0)
- Kehadiran: 50% (Sangat kurang)
- MK Mengulang: 5 (Banyak)
- SKS Lulus: 40/144 (28%)
- Sisa Waktu: 2 tahun (Terbatas)

Expected Output:
- Q5: IPK 1.8 → Status BAHAYA (🔴)
- Q8: Kehadiran 50% → Status BAHAYA (🔴)
- Q9: MK Mengulang 5 → Status BAHAYA (🔴)
- Q12: Status TA → Status PERINGATAN (🟡)
- Q13: Risk Score 18/20 (Sangat Tinggi) 🔴 URGENT

Rekomendasi: Konsultasi Dekan, program pembinaan khusus
```

### Test Case #3: Mahasiswa Normal (NORMAL)
**Scenario**: Mahasiswa tahun kedua dengan progress normal
```
Data Simulasi:
- IPK: 2.8 (Normal)
- Kehadiran: 78% (Cukup)
- MK Mengulang: 1
- SKS Lulus: 45/144 (31%)
- Lama Studi: 2 tahun

Expected Output:
- Q5: IPK 2.8 → Status PERINGATAN (🟡)
- Q8: Kehadiran 78% → Status PERINGATAN (🟡)
- Q13: Risk Score 5/20 (Sedang) 🟡 MONITOR

Rekomendasi: Monitor dan konsultasi rutin
```

---

## 🚀 Deployment Instructions

### Pre-Deployment Checklist

#### 1. Code Quality Check
```bash
# Install dependencies
cd front-end
npm install

# Run linter
npm run lint

# Build project
npm run build

# Check for errors
npm run type-check
```

#### 2. Environment Setup
```bash
# Ensure Node.js version
node --version  # Should be 18.x or higher

# Verify Next.js configuration
cat next.config.ts

# Check Tailwind CSS configuration
cat tailwind.config.ts

# Verify Heroicons package
npm list heroicons  # Should be installed
```

#### 3. Database Backup
```bash
# Backup current database
mysqldump -u root -p unismuh_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup
ls -la backup_*.sql
```

### Deployment Steps

#### Step 1: Staging Deployment
```bash
# SSH into staging server
ssh user@staging-server.com

# Pull latest code
cd /var/www/smart-system/
git pull origin main

# Install dependencies (if needed)
npm install --production

# Build application
npm run build

# Restart service
sudo systemctl restart smart-system-frontend
```

#### Step 2: Verification on Staging
```bash
# Check if application is running
curl http://staging-server.com:3000/analisis-mahasiswa

# Check error logs
tail -f /var/log/smart-system-frontend.log

# Monitor memory usage
free -h
df -h
```

#### Step 3: User Acceptance Testing (UAT)
- [ ] Dekan test di staging environment
- [ ] Test all 13 questions load correctly
- [ ] Verify calculations are accurate
- [ ] Check responsive design
- [ ] Get approval sign-off

#### Step 4: Production Deployment
```bash
# SSH into production server
ssh user@prod-server.com

# Backup current version
cp -r /var/www/smart-system /var/www/smart-system.backup.$(date +%Y%m%d)

# Pull latest code
cd /var/www/smart-system/
git pull origin main

# Install dependencies
npm install --production

# Build application
npm run build

# Start service
sudo systemctl start smart-system-frontend

# Verify deployment
curl http://prod-server.com/analisis-mahasiswa
```

---

## 📊 Performance Monitoring

### Metrics to Track
```javascript
// Dalam aplikasi Next.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function usePerformanceMetrics() {
  const router = useRouter();

  useEffect(() => {
    // Track page load time
    const handleRouteChange = (url) => {
      const currentPage = performance.timing;
      const pageLoadTime = currentPage.loadEventEnd - currentPage.navigationStart;
      console.log(`Page load time: ${pageLoadTime}ms`);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
}
```

### Key Performance Indicators (KPIs)
| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Page Load Time | <2s | >3s | >5s |
| API Response | <500ms | >1s | >2s |
| Memory Usage | <500MB | >700MB | >1GB |
| CPU Usage | <30% | >50% | >80% |
| Error Rate | <0.1% | >0.5% | >1% |

---

## 🔐 Security Considerations

### Data Protection
```typescript
// Ensure sensitive data is not logged
// ❌ DON'T
console.log(mahasiswaData.email); // Sensitive!

// ✅ DO
console.log('Data loaded successfully');

// Mask PII in logs
const maskEmail = (email: string) => {
  return email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
};
```

### API Security
```typescript
// Validate and sanitize all inputs
import sanitizeHtml from 'sanitize-html';

const sanitizeInput = (input: string) => {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {}
  });
};
```

### CORS Configuration
```typescript
// In next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGIN || '*'
          }
        ]
      }
    ];
  }
};
```

---

## 🐛 Troubleshooting Guide

### Issue #1: Questions Not Loading
```bash
# Check browser console for errors
# F12 → Console tab

# Check if JavaScript is enabled
# Check network requests in Network tab

# Solution:
# 1. Clear browser cache: Ctrl+Shift+Delete
# 2. Hard refresh: Ctrl+Shift+R
# 3. Check backend API connectivity
```

### Issue #2: Styling Issues (Colors not showing)
```bash
# Verify Tailwind CSS is compiled
npm run build

# Check if styles are being loaded
# In browser DevTools → Sources → check .css files

# Solution:
# 1. Rebuild: npm run build
# 2. Clear .next folder: rm -rf .next
# 3. Reinstall: npm install
```

### Issue #3: Calculations Wrong
```typescript
// Debug calculation functions
const debugAnalysis = (mahasiswaData) => {
  console.log('Input Data:', mahasiswaData);
  console.log('Calculated Values:', {
    sks_lulus: mahasiswaData.sks_lulus,
    total_sks: mahasiswaData.total_sks_wajib,
    persen: Math.round((mahasiswaData.sks_lulus / mahasiswaData.total_sks_wajib) * 100)
  });
};
```

### Issue #4: Performance Slow
```bash
# Check browser performance
# F12 → Performance tab → Record and analyze

# Check backend response time
curl -w '@curl-format.txt' http://api-server/endpoint

# Optimize bundle size
npm run analyze  # Requires next/bundle-analyzer

# Solutions:
# 1. Implement code splitting
# 2. Lazy load components
# 3. Optimize images
# 4. Cache API responses
```

---

## 📱 Mobile Responsive Testing

### Devices to Test
- [ ] iPhone 12 (390x844)
- [ ] iPhone 12 Pro (390x844)
- [ ] iPhone 14 Pro Max (430x932)
- [ ] Samsung Galaxy S21 (360x800)
- [ ] Samsung Galaxy Tab S7 (800x1280)
- [ ] iPad (768x1024)
- [ ] iPad Pro (1024x1366)

### Responsive Testing Steps
```bash
# Open DevTools: F12
# Click device toggle: Ctrl+Shift+M
# Test each breakpoint:
# - Mobile: <640px (sm)
# - Tablet: 640-1024px (md)
# - Desktop: >1024px (lg)

# Check:
# ✓ Layout tidak broken
# ✓ Text readable
# ✓ Buttons clickable
# ✓ Images scaled properly
# ✓ Navigation accessible
```

---

## 📚 Documentation Links

### Internal Documentation
- [Pertanyaan Analisis Update](./PERTANYAAN_ANALISIS_UPDATE.md)
- [Technical Summary](./TECHNICAL_SUMMARY.md)
- [Contoh Output](./CONTOH_OUTPUT_PERTANYAAN.md)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Heroicons](https://heroicons.com/)
- [React Hooks Guide](https://react.dev/reference/react)

---

## 👥 Support & Contact

### Development Team
- **Frontend Lead**: Smart System Team
- **Backend Integration**: API Team
- **QA & Testing**: Quality Assurance Team

### Escalation Path
```
Issue Found
    ↓
Report to Development Team
    ↓
If Production Down: Escalate to IT Manager
    ↓
If Critical: Escalate to Dekan/Rector
```

### Communication Channels
- 📧 Email: smart-system@unismuh.ac.id
- 💬 Slack: #smart-system-dev
- 📞 Phone: +62-xxx-xxxx-xxxx
- 🎫 Jira: [Smart System Project Board]

---

## 📈 Roadmap untuk Development Berikutnya

### Version 2.1 (Next Sprint)
- [ ] Add export to PDF functionality
- [ ] Add export to Excel functionality
- [ ] Historical tracking untuk comparison semester ke semester
- [ ] Email notification untuk mahasiswa berisiko
- [ ] SMS alert untuk kasus urgent

### Version 2.2 (Quarter 2)
- [ ] Dashboard for Admin/Dekan
- [ ] Real-time notification system
- [ ] Advanced analytics dan reporting
- [ ] Integration dengan sistem presensi otomatis
- [ ] Mobile app native (iOS & Android)

### Version 3.0 (Year 2)
- [ ] AI-powered prediction untuk risiko DO
- [ ] Personalized intervention recommendations
- [ ] Integration dengan academic planning system
- [ ] Multi-university support
- [ ] Blockchain verification untuk credentials

---

## ✅ Sign-Off Checklist

- [ ] Code review completed and approved
- [ ] All tests passing
- [ ] Documentation complete and reviewed
- [ ] Staging deployment successful
- [ ] UAT completed and approved
- [ ] Security review completed
- [ ] Performance benchmarks met
- [ ] Backup created
- [ ] Deployment plan finalized
- [ ] Team trained and ready
- [ ] Rollback plan documented
- [ ] Production deployment approved

---

## 📝 Deployment Notes

**Date**: 29 January 2026
**Version**: 2.0
**Files Modified**: 1 (analisis-mahasiswa/page.tsx)
**Breaking Changes**: None
**Database Changes**: None (only UI update)
**Backward Compatibility**: 100% Compatible

---

**Status**: 🟢 READY FOR DEPLOYMENT
**Approval Required**: Dekan / CTO
**Estimated Deployment Time**: 30 minutes
**Estimated Rollback Time**: 15 minutes

