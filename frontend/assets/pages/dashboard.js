// Generate status badge HTML based on tag status (집/소지/비소지)
function statusBadge(status) {
  if (status === 'LOST' || status === '비소지') {
    return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold animate-pulse-slow"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>비소지</span>`;
  }
  if (status === 'FOUND' || status === '소지') {
    return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>소지</span>`;
  }
  return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>집</span>`;
}

// Load and display dashboard data including family info, stats, and member list
async function loadDashboard() {
  const esc = smartscanLayout.escapeHtml;
  try {
    const res = await smartscanApi.getDashboard();
    const d = res.data;
    document.getElementById('family-name').textContent = d.family_name || '-';
    document.getElementById('stat-total').textContent = d.summary.total_tags;
    document.getElementById('stat-found').textContent = d.summary.found_count;
    document.getElementById('stat-lost').textContent = d.summary.lost_count;
    document.getElementById('stat-members').textContent = d.summary.total_members;

    const missingCard = document.getElementById('missing-card');
    if (d.summary.lost_count > 0) {
      missingCard.classList.add('border-red-200');
      document.getElementById('system-status').textContent = `비소지 ${d.summary.lost_count}개`;
      document.getElementById('system-status').className = 'px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium';
    }

    const tbody = document.getElementById('members-tbody');
    if (!d.members || d.members.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" class="px-6 py-8 text-center text-slate-400">No registered members.</td></tr>`;
    } else {
      // Render member rows with dynamic status badges and item counts
      tbody.innerHTML = d.members.map((m) => {
        const initial = esc(m.name || '?').charAt(0);
        // Determine status badge based on member's item status
        const status = m.lost_count > 0
          ? `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold animate-pulse-slow"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>비소지 ${m.lost_count}개</span>`
          : m.tag_count === 0
            ? `<span class="text-xs text-slate-400">태그 없음</span>`
            : `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>소지중</span>`;
        return `
          <tr class="hover:bg-slate-50">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-[#034EA2]/10 text-[#034EA2] flex items-center justify-center font-semibold text-sm">${esc(initial)}</div>
                <div>
                  <div class="font-semibold text-slate-800">${esc(m.name)}</div>
                  <div class="text-xs text-slate-400">${esc(m.role || '')}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-slate-600">${m.tag_count}개 (소지 ${m.found_count} · 비소지 ${m.lost_count} · 집 ${m.registered_count})</td>
            <td class="px-6 py-4">${status}</td>
          </tr>`;
      }).join('');
    }

    const me = smartscanApi.getUser();
    const sel = document.getElementById('notify-user');
    d.members
      .filter((m) => m.user_id && m.user_id !== (me && me.user_id))
      .forEach((m) => {
        const opt = document.createElement('option');
        opt.value = m.user_id;
        opt.textContent = `${m.name} (${m.email || '-'})`;
        sel.appendChild(opt);
      });
  } catch (err) {
    console.error(err);
    document.getElementById('members-tbody').innerHTML = `<tr><td colspan="3" class="px-6 py-8 text-center text-red-500">Dashboard query failed: ${esc(err.message)}</td></tr>`;
  }
}

// Load and display all family items with tag status
async function loadMyTags() {
  const esc = smartscanLayout.escapeHtml;
  try {
    const res = await smartscanApi.getItems();
    const tbody = document.getElementById('mytags-tbody');
    const items = (res.data && res.data.items) || [];
    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-8 text-center text-slate-400">등록된 소지품이 없습니다.</td></tr>`;
      return;
    }
    tbody.innerHTML = items.map((it) => `
      <tr class="hover:bg-slate-50">
        <td class="px-6 py-3.5 text-slate-800 font-medium">${esc(it.name)}</td>
        <td class="px-6 py-3.5 text-slate-600">${esc(it.owner_name || '-')}</td>
        <td class="px-6 py-3.5">${statusBadge(it.tag_status || '')}</td>
        <td class="px-6 py-3.5 text-slate-500">${it.updated_at ? new Date(it.updated_at).toLocaleDateString('ko-KR') : '-'}</td>
      </tr>`).join('');
  } catch (err) {
    console.error(err);
    document.getElementById('mytags-tbody').innerHTML = `<tr><td colspan="4" class="px-6 py-8 text-center text-red-500">조회 실패: ${esc(err.message)}</td></tr>`;
  }
}

// Initialize dashboard page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  smartscanLayout.init({ active: 'dashboard' });
  const esc = smartscanLayout.escapeHtml;
  const fmt = smartscanLayout.formatDateTime;

  // Handle notification form submission to send alerts to family members
  document.getElementById('notify-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('notify-user').value;
    const channel = document.getElementById('notify-channel').value;
    const title = document.getElementById('notify-title').value.trim();
    const message = document.getElementById('notify-message').value.trim();
    if (!userId) return smartscanLayout.toast('Please select a member.', 'error');
    if (!title || !message) return smartscanLayout.toast('Please enter title and message.', 'error');

    const btn = document.getElementById('notify-submit');
    btn.disabled = true;
    try {
      await smartscanApi.sendNotification(userId, { channel, title, message });
      smartscanLayout.toast('Notification sent successfully.', 'success');
      document.getElementById('notify-title').value = '';
      document.getElementById('notify-message').value = '';
    } catch (err) {
      smartscanLayout.toast(err.message || 'Notification send failed', 'error');
    } finally {
      btn.disabled = false;
    }
  });

  loadDashboard();
  loadMyTags();
});